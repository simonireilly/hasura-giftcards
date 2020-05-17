exports.up = function (knex) {
  return knex.schema
    .raw(`
    CREATE SCHEMA IF NOT EXISTS public;

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE OR REPLACE FUNCTION generate_verification_code(INTEGER, INTEGER) RETURNS INTEGER AS $$
    DECLARE
        start_int ALIAS FOR $1;
        end_int ALIAS FOR $2;
    BEGIN
        RETURN trunc(random() * (end_int-start_int) + start_int);
    END;
    $$ LANGUAGE 'plpgsql' STRICT;
    `)
}

exports.down = function (knex) {
  return knex.schema
    .raw('show statement_timeout;')
}
