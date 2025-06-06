import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntitiesAnimalDossiermedical1745964679802 implements MigrationInterface {
    name = 'UpdateEntitiesAnimalDossiermedical1745964679802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_reset\` DROP FOREIGN KEY \`FK_ad88301fdc79593dd222268a8b6\``);
        await queryRunner.query(`CREATE TABLE \`dossier_medical\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`observations\` varchar(255) NULL, \`antecedants\` varchar(255) NULL, \`allergies\` varchar(255) NULL, \`etatsante\` varchar(255) NOT NULL, \`poids\` float NOT NULL, \`animalId\` int NULL, UNIQUE INDEX \`REL_00a91c89fd584b0a770b67c587\` (\`animalId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP COLUMN \`poids\``);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP COLUMN \`etatSante\``);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` DROP FOREIGN KEY \`FK_1f5e23f7f31776c71c71195e69f\``);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`telephone\` \`telephone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`adresse\` \`adresse\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`twoFactorSecret\` \`twoFactorSecret\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`lastLogin\` \`lastLogin\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`verificationToken\` \`verificationToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`verificationExpires\` \`verificationExpires\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`numLicence\` \`numLicence\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`specialites\` \`specialites\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`cliniqueId\` \`cliniqueId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`clinique\` CHANGE \`coordonneesGPS\` \`coordonneesGPS\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`fiche_medicale\` CHANGE \`notes\` \`notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`proprietaireId\` \`proprietaireId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` ADD CONSTRAINT \`FK_1f5e23f7f31776c71c71195e69f\` FOREIGN KEY (\`cliniqueId\`) REFERENCES \`clinique\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` ADD CONSTRAINT \`FK_00a91c89fd584b0a770b67c5879\` FOREIGN KEY (\`animalId\`) REFERENCES \`animal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` ADD CONSTRAINT \`FK_ad88301fdc79593dd222268a8b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_reset\` DROP FOREIGN KEY \`FK_ad88301fdc79593dd222268a8b6\``);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` DROP FOREIGN KEY \`FK_00a91c89fd584b0a770b67c5879\``);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` DROP FOREIGN KEY \`FK_1f5e23f7f31776c71c71195e69f\``);
        await queryRunner.query(`ALTER TABLE \`password_reset\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`proprietaireId\` \`proprietaireId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`fiche_medicale\` CHANGE \`notes\` \`notes\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clinique\` CHANGE \`coordonneesGPS\` \`coordonneesGPS\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`cliniqueId\` \`cliniqueId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`specialites\` \`specialites\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`numLicence\` \`numLicence\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`verificationExpires\` \`verificationExpires\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`verificationToken\` \`verificationToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`lastLogin\` \`lastLogin\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`twoFactorSecret\` \`twoFactorSecret\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`adresse\` \`adresse\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`telephone\` \`telephone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` ADD CONSTRAINT \`FK_1f5e23f7f31776c71c71195e69f\` FOREIGN KEY (\`cliniqueId\`) REFERENCES \`clinique\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD \`etatSante\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD \`poids\` float(12) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`REL_00a91c89fd584b0a770b67c587\` ON \`dossier_medical\``);
        await queryRunner.query(`DROP TABLE \`dossier_medical\``);
        await queryRunner.query(`ALTER TABLE \`password_reset\` ADD CONSTRAINT \`FK_ad88301fdc79593dd222268a8b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
