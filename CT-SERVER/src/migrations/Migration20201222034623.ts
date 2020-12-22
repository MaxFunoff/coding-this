import { Migration } from '@mikro-orm/migrations';

export class Migration20201222034623 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("id" serial primary key, "post_id" int4 not null, "user_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" text not null);');
  }

}
