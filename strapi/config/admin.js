module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '0bb4d6fbe9ffe647b5ef199ed63eef46'),
  },
});
