// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    //table.increments('id')
    // table.uuid('id', {useBinaryUuid:false, primaryKey:true})
    table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4 ()"))
    table.string('text')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
