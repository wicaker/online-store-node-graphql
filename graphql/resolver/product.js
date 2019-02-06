const User = require("../../models/user");
const Product = require("../../models/product");

module.exports = {
  // @query products: [Product!]!
  // @desc get all products
  // Public
  products: () => {
    return Product.find()
      .then(products => {
        return products.map(product => {
          return {
            ...product._doc,
            _id: product.id
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },

  // @mutation createProduct(productInput: ProductInput) : Product
  // @desc create new product
  // @access Private, administrator
  createProduct: (args, req) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    const product = new Product({
      name: args.productInput.name,
      price: +args.productInput.price,
      weight: +args.productInput.weight,
      description: args.productInput.description,
      specification: args.productInput.specification,
      variation: args.productInput.variation,
      tags: args.productInput.tags,
      category: args.productInput.category,
      stock: args.productInput.stock,
      picture: args.productInput.picture,
      seller: req.userId.userId
    });
    return product
      .save()
      .then(result => {
        User.findById(req.userId.userId).then(resultId => {
          let sellingId = resultId.sellingProducts;
          sellingId.push(result._id);
          resultId.set({ sellingProducts: sellingId });
          resultId.save();
        });
        return result;
      })
      .catch(err => {
        throw err;
      });
  },

  // @query products(id: ID!) : Product!
  // @desc api for get detail product
  // @access Public
  product: async ({ id }) => {
    const productDetail = await Product.find({ _id: id });
    return productDetail[0];
  },

  // @query products(category: String!): [Product!]!
  // @desc query api for get products base on category
  // @access Public
  productsCategory: async args => {
    const productDetail = await Product.find({ category: args.category });
    return productDetail;
  },

  // @query  adminProducts : Product!
  // @desc get products was created by administrator
  // @access Private, administrator
  adminProducts: async (args, req) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    const listProducts = await Product.find({ seller: req.userId.userId });
    return listProducts;
  },

  // @mutation deleteAdminProduct : Product!
  // @desc delete product was created by administrator
  // @access Private, administrator
  deleteAdminProduct: async (args, req) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    const adminProduct = await Product.findById(args.productId);
    adminProduct.remove();
    return adminProduct;
  },

  // @mutation editAdmitProduct : Product!
  // @desc edit product was created by administrator
  // @access Private, administrator
  editAdminProduct: async (args, req) => {
    if (!req.isAuth || req.userId.status !== "administrator") {
      throw new Error("Unauthenticated");
    }
    return Product.findByIdAndUpdate(
      args.idProduct,
      {
        $set: {
          name: args.productInput.name,
          price: +args.productInput.price,
          weight: +args.productInput.weight,
          description: args.productInput.description,
          specification: args.productInput.specification,
          variation: args.productInput.variation,
          tags: args.productInput.tags,
          category: args.productInput.category,
          stock: args.productInput.stock,
          picture: args.productInput.picture
        }
      },
      { new: true },
      function(err, product) {
        if (err) return handleError(err);
        return product;
      }
    );
  }
};
