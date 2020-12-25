import { Migration } from '@mikro-orm/migrations';

export class Migration20201222143748 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "user_id";');
  }

}
