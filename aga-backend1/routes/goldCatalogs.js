const express = require('express');

const router = express.Router();

const toNumber = (value) => {
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
};

router.get('/', async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    const search = (req.query.search || '').trim();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
      ];
    }

    const category = (req.query.category || '').toLowerCase();
    if (category && category !== 'all') {
      if (category === 'bars') {
        filter.name = { $regex: 'bar', $options: 'i' };
      } else if (category === 'coins') {
        filter.name = { $regex: 'coin', $options: 'i' };
      }
    }

    const minPrice = toNumber(req.query.minPrice);
    const maxPrice = toNumber(req.query.maxPrice);
    if (minPrice !== null && maxPrice !== null) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== null) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice !== null) {
      filter.price = { $lte: maxPrice };
    }

    const minStock = toNumber(req.query.minStock);
    const maxStock = toNumber(req.query.maxStock);
    if (minStock !== null && maxStock !== null) {
      filter.stock = { $gte: minStock, $lte: maxStock };
    } else if (minStock !== null) {
      filter.stock = { $gte: minStock };
    } else if (maxStock !== null) {
      filter.stock = { $lte: maxStock };
    }

    const stockStatus = req.query.stockStatus;
    if (stockStatus) {
      switch (stockStatus) {
        case 'in-stock':
          filter.stock = { $gt: 0 };
          break;
        case 'out-of-stock':
          filter.stock = 0;
          break;
        case 'low-stock':
          filter.stock = { $lte: 10, $gt: 0 };
          break;
        case 'high-stock':
          filter.stock = { $gt: 50 };
          break;
        default:
          break;
      }
    }

    const weights = toArray(req.query.weight);
    if (weights.length) {
      filter.weight = { $in: weights };
    }

    const purity = toArray(req.query.purity);
    if (purity.length) {
      filter.purity = { $in: purity };
    }

    const brand = toArray(req.query.brand);
    if (brand.length) {
      filter.brand = { $in: brand };
    }

    const manufacturer = toArray(req.query.manufacturer);
    if (manufacturer.length) {
      filter.manufacturer = { $in: manufacturer };
    }

    const placement = toArray(req.query.placement);
    if (placement.length) {
      filter.placement = { $in: placement };
    }

    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(`${dateTo}T23:59:59.999Z`);
      }
    }

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    let sortObject = {};
    switch (sortBy) {
      case 'price':
        sortObject = { price: sortOrder };
        break;
      case 'stock':
        sortObject = { stock: sortOrder };
        break;
      case 'weight':
        sortObject = { weightNumeric: sortOrder };
        break;
      case 'name':
        sortObject = { name: sortOrder };
        break;
      case 'popularity':
        sortObject = { views: sortOrder, createdAt: -1 };
        break;
      default:
        sortObject = { [sortBy]: sortOrder };
    }

    const products = await req.db
      .collection('goldCatalog')
      .find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await req.db.collection('goldCatalog').countDocuments(filter);
    const allProducts = await req.db.collection('goldCatalog').find({ isActive: true }).toArray();

    const categoriesMap = {};
    const puritySet = new Set();
    const brandsSet = new Set();
    const manufacturersSet = new Set();
    const placementsSet = new Set();
    let globalMinPrice = Number.POSITIVE_INFINITY;
    let globalMaxPrice = 0;
    let globalMinStock = Number.POSITIVE_INFINITY;
    let globalMaxStock = 0;
    let globalMinWeight = Number.POSITIVE_INFINITY;
    let globalMaxWeight = 0;

    allProducts.forEach((product) => {
      let cat = 'Special Edition';
      if (/bar/i.test(product.name)) cat = 'Gold Bars';
      else if (/coin/i.test(product.name)) cat = 'Gold Coins';

      if (!categoriesMap[cat]) categoriesMap[cat] = new Set();
      if (product.weight) categoriesMap[cat].add(product.weight);

      globalMinPrice = Math.min(globalMinPrice, product.price);
      globalMaxPrice = Math.max(globalMaxPrice, product.price);
      globalMinStock = Math.min(globalMinStock, product.stock);
      globalMaxStock = Math.max(globalMaxStock, product.stock);

      const weightNum = Number.parseFloat(product.weight) || 0;
      globalMinWeight = Math.min(globalMinWeight, weightNum);
      globalMaxWeight = Math.max(globalMaxWeight, weightNum);

      if (product.purity) puritySet.add(product.purity);
      if (product.brand) brandsSet.add(product.brand);
      if (product.manufacturer) manufacturersSet.add(product.manufacturer);
      if (product.placement) placementsSet.add(product.placement);
    });

    const categories = Object.keys(categoriesMap).map((cat) => ({
      name: cat,
      subcategories: Array.from(categoriesMap[cat]),
    }));

    const filters = {
      categories,
      minPrice: globalMinPrice === Number.POSITIVE_INFINITY ? 0 : globalMinPrice,
      maxPrice: globalMaxPrice === 0 ? 0 : globalMaxPrice,
      minStock: globalMinStock === Number.POSITIVE_INFINITY ? 0 : globalMinStock,
      maxStock: globalMaxStock === 0 ? 0 : globalMaxStock,
      minWeight: globalMinWeight === Number.POSITIVE_INFINITY ? 0 : globalMinWeight,
      maxWeight: globalMaxWeight === 0 ? 0 : globalMaxWeight,
      purity: Array.from(puritySet).sort(),
      brands: Array.from(brandsSet).sort(),
      manufacturers: Array.from(manufacturersSet).sort(),
      placements: Array.from(placementsSet).sort(),
    };

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;

