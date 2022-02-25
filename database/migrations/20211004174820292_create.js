/* eslint-disable camelcase */

exports.shorthands = undefined;



exports.up = pgm => {
  pgm.createTable('user',{
    id: { type: 'serial', primaryKey: true },
    name: { type: 'text', notNull: true},
    password: { type: 'text', notNull: true},
    email: { type: 'text', notNull: true},
    delete: { type: 'boolean', notNull: true},
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('product',{
    id: { type: 'serial', primaryKey: true },
    name: { type: 'text', notNull: true},
    status: { type: 'text', notNull: true},
    qtd: { type: 'integer', notNull: true},
    qtd_min: { type: 'integer', notNull: true},
    qtd_max: { type: 'integer', notNull: true},
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('company',{
    id:   { type: 'serial', primaryKey: true },
    name: { type: 'text', notNull: true},
    cnpj: { type: 'text', notNull: true},
    createdAt: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  })
};

exports.down = pgm => {
  pgm.dropTable('company', { ifExists: true })
  pgm.dropTable('product', { ifExists: true })
  pgm.dropTable('user', { ifExists: true })
};


