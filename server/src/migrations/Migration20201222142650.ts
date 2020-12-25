import { Migration } from '@mikro-orm/migrations';

export class Migration20201222142650 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "user_id" int4 null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
