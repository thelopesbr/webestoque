/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('user',{
        company_id:{
            type: 'integer',
            notNull: true,
            references: '"company"',
            onDelete: 'cascade'
          },
    })
    pgm.addColumns('product',{
        company_id:{
            type: 'integer',
            notNull: true,
            references: '"company"',
            onDelete: 'cascade'
          },
    })
};

exports.down = pgm => {
    pgm.dropColumns('product','company_id', {ifExists: true, cascade: true} )
    pgm.dropColumns('user','company_id', {ifExists: true, cascade: true} )
};
