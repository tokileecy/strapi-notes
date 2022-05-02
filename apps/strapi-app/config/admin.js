module.exports = ({ env }) => ({
  apiToken: {
    salt: env('API_TOKEN_SALT', 'ffjwq7wqe9qw9dv2221215707b4e3e7'),
  },
  auth: {
    secret: env('ADMIN_JWT_SECRET', '0bb4d6fbe9ffe647b5ef199ed63eef46'),
  },
});
