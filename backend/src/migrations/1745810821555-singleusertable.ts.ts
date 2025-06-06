import { MigrationInterface, QueryRunner } from 'typeorm';

export class Singleusertable_ts1745810821555 implements MigrationInterface {
  name = 'Singleusertable.ts1745810821555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`utilisateur\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`nom\` varchar(255) NOT NULL, \`prenom\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`motDePasse\` varchar(255) NOT NULL, \`role\` enum ('ADMINISTRATEUR', 'PROPRIETAIRE_ANIMAL', 'VETERINAIRE') NOT NULL, \`telephone\` varchar(255) NULL, \`adresse\` varchar(255) NULL, \`estVerifie\` tinyint NOT NULL DEFAULT 0, \`twoFactorEnabled\` tinyint NOT NULL DEFAULT 0, \`twoFactorSecret\` varchar(255) NULL, \`lastLogin\` datetime NULL, \`verificationToken\` varchar(255) NULL, \`verificationExpires\` datetime NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`numLicence\` varchar(255) NULL, \`specialites\` varchar(255) NULL, \`type\` varchar(255) NOT NULL, \`cliniqueId\` int NULL, UNIQUE INDEX \`IDX_e1136325a6b28e2a02b81b2f5e\` (\`email\`), UNIQUE INDEX \`IDX_388c3721d7a904351dffb429c1\` (\`numLicence\`), INDEX \`IDX_c01c880e77c53d805415d76a66\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`clinique\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nom\` varchar(255) NOT NULL, \`adresse\` varchar(255) NOT NULL, \`telephone\` varchar(255) NOT NULL, \`horairesOuverture\` varchar(255) NOT NULL, \`coordonneesGPS\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`animal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nom\` varchar(255) NOT NULL, \`espece\` varchar(255) NOT NULL, \`race\` varchar(255) NOT NULL, \`dateNaissance\` date NOT NULL, \`sexe\` varchar(255) NOT NULL, \`poids\` float NOT NULL, \`etatSante\` varchar(255) NOT NULL, \`proprietaireId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`fiche_medicale\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` varchar(255) NOT NULL, \`diagnostic\` varchar(255) NOT NULL, \`traitement\` varchar(255) NOT NULL, \`notes\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`utilisateur\` ADD CONSTRAINT \`FK_1f5e23f7f31776c71c71195e69f\` FOREIGN KEY (\`cliniqueId\`) REFERENCES \`clinique\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`utilisateur\` DROP FOREIGN KEY \`FK_1f5e23f7f31776c71c71195e69f\``,
    );
    await queryRunner.query(`DROP TABLE \`fiche_medicale\``);
    await queryRunner.query(`DROP TABLE \`animal\``);
    await queryRunner.query(`DROP TABLE \`clinique\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c01c880e77c53d805415d76a66\` ON \`utilisateur\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_388c3721d7a904351dffb429c1\` ON \`utilisateur\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e1136325a6b28e2a02b81b2f5e\` ON \`utilisateur\``,
    );
    await queryRunner.query(`DROP TABLE \`utilisateur\``);
  }
}
