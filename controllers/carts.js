const Carts = require('../models/carts')
const Products = require('../models/products')
const Users = require('../models/users')
const errorFunction = require('../utils/errorFunction')

// CRUD
// CREATE - POST
const addCart = async (req, res, next) => {
  try {
    const productId = await Products.findById(req.body.productId)
    const userId = await Users.findById(req.body.userId)
    if (!userId) {
      return res.json(
        errorFunction(true, 204, 'This user Id have not in the database'),
      )
    }
    if (!productId) {
      return res.json(
        errorFunction(true, 204, 'This product Id have not in the database'),
      )
    }
    const newCart = await Carts.create(req.body)
    if (newCart) {
      res.status(201)
      return res.json(errorFunction(false, 201, 'Cart Created', newCart))
    } else {
      res.status(403)
      return res.json(errorFunction(true, 403, 'Error Creating Cart'))
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

const addCartAndUpdateCart = async (req, res, next) => {
  try {
    const filter = {
      $and: [
        {
          productId: {
            $regex: req.body.productId,
            $options: '$i',
          },
        },
        {
          userId: {
            $regex: req.body.userId,
            $options: '$i',
          },
        },
      ],
    }
    const productId = await Products.findById(req.body.productId)
    const userId = await Users.findById(req.body.userId)
    if (!userId) {
      return res.json(
        errorFunction(true, 204, 'This user Id have not in the database'),
      )
    }
    if (!productId) {
      return res.json(
        errorFunction(true, 204, 'This product Id have not in the database'),
      )
    }
    const cartItem = await Carts.find(filter)
    if (cartItem.length === 0) {
      const newCart = await Carts.create(req.body)
      if (newCart) {
        res.status(201)
        return res.json(errorFunction(false, 201, 'Cart Created', newCart))
      } else {
        res.status(403)
        return res.json(errorFunction(true, 403, 'Error Creating Cart'))
      }
    } else {
      const cartId = cartItem[0]._id
      const quantity = cartItem[0].quantity + req.body.quantity
      updateSameProduct(cartId, quantity, res)
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

// READ - GET || POST
// get all carts

const getAllCarts = async (req, res, next) => {
  try {
    const {
      pageSize = 12,
      pageNumber = 1,
      productName = '',
      productBrand = '',
      type = '',
      orderByColumn,
      orderByDirection = 'desc',
    } = req.query
    const filter = {
      $and: [
        {
          productName: {
            $regex: productName,
            $options: '$i',
          },
        },
        {
          productBrand: {
            $regex: productBrand,
            $options: '$i',
          },
        },
        {
          type: {
            $regex: type,
            $options: '$i',
          },
        },
      ],
    }
    // console.log(await Carts.find(filter))
    const filterCarts = await Carts.find(filter)
      .sort(`${orderByDirection === 'asc' ? '' : '-'}${orderByColumn}`)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize)

    const allCarts = await Carts.find(filter)

    let totalPage = 0
    if (allCarts.length % pageSize === 0) {
      totalPage = allCarts.length / pageSize
    } else {
      totalPage = parseInt(allCarts.length / pageSize) + 1
    }

    if (allCarts.length > 0) {
      return res.status(200).json({
        totalPage: totalPage,
        totalCarts: allCarts.length,
        carts:
          orderByDirection && orderByColumn
            ? filterCarts
            : filterCarts.reverse(),
      })
    } else {
      return res.status(200).json({
        message: 'No results',
        carts: [],
      })
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

// get by id
const getCartById = async (req, res, next) => {
  const cartId = req.params.cartId
  try {
    const cart = await Carts.findById(cartId)
    if (cart) {
      res.status(200).json({
        statusCode: 200,
        cart,
      })
    } else {
      return res.json(
        errorFunction(true, 204, 'This cart Id have not in the database'),
      )
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

// get by user id
const getCartByUserId = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const filter = {
      $and: [
        {
          userId: {
            $regex: userId,
            $options: '$i',
          },
        },
      ],
    }
    const carts = await Carts.find(filter)
    if (carts) {
      res.status(200).json({
        statusCode: 200,
        total: carts.length,
        carts: carts.reverse(),
      })
    } else {
      return res.json(
        errorFunction(true, 204, 'This cart Id have not in the database'),
      )
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

// UPDATE - PUT || PATCH

const editCart = (req, res, next) => {
  try {
    const cartId = req.params.cartId
    const isBodyEmpty = Object.keys(req.body).length
    if (isBodyEmpty === 0) {
      return res.json(errorFunction(true, 404, 'Body request can not empty.'))
    }

    Carts.findByIdAndUpdate(cartId, req.body).then((data) => {
      if (data) {
        return res.status(200).json({
          statusCode: 200,
          message: 'Updated cart successfully',
        })
      } else {
        return res.json(
          errorFunction(true, 204, 'This cart Id have not in the database'),
        )
      }
    })
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

// UPDATE - PUT || PATCH - UPDATE QUANTITY OF CART PROPDUCT
const updateSameProduct = (cartId, quantity, res) => {
  try {
    const request = { quantity: quantity }
    Carts.findByIdAndUpdate(cartId, request).then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Cart with id=${id}. Maybe Product was not found!`,
        })
      } else {
        return res.json(errorFunction(false, 201, 'Cart Created', data))
      }
    })
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}
// DELETE - DELETE

// delete cart by id
const deleteCartById = async (req, res, next) => {
  const cartId = req.params.cartId
  try {
    const cart = await Carts.findByIdAndRemove(cartId)
    if (cart) {
      res.status(200).json({
        statusCode: 200,
        message: 'Deleted cart successfully',
      })
    } else {
      return res.json(
        errorFunction(true, 204, 'This cart Id have not in the database'),
      )
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

// delete multiple carts
const deleteMultipleCarts = async (req, res, next) => {
  const listProductsId = req.body
  try {
    Promise.all(
      listProductsId.map((productId) => Carts.findByIdAndRemove(productId)),
    )
      .then((response) => {
        res.status(200)
        return res.json(
          errorFunction(false, 200, 'Deleted products in cart Successfully!'),
        )
      })
      .catch((error) => {
        res.status(400)
        return res.json(errorFunction(true, 400, 'Bad request'))
      })
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

module.exports = {
  addCart,
  addCartAndUpdateCart,
  getAllCarts,
  getCartById,
  getCartByUserId,
  deleteCartById,
  deleteMultipleCarts,
  editCart,
}
