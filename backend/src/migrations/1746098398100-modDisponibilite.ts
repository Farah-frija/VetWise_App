import { MigrationInterface, QueryRunner } from "typeorm";

export class ModDisponibilite1746098398100 implements MigrationInterface {
    name = 'ModDisponibilite1746098398100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`disponibilite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`jourSemaine\` varchar(255) NOT NULL, \`heureDebut\` time NOT NULL, \`heureFin\` time NOT NULL, \`disponible\` tinyint NOT NULL DEFAULT 1, \`mode\` enum ('online', 'inplace', 'both') NOT NULL, \`estExceptionnelle\` tinyint NOT NULL DEFAULT 0, \`dateExceptionnelle\` date NULL, \`veterinaire_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`clinique\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`clinique\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`clinique\` ADD \`deletedAt\` datetime(6) NULL`);
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
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` DROP FOREIGN KEY \`FK_00a91c89fd584b0a770b67c5879\``);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`observations\` \`observations\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`antecedants\` \`antecedants\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`allergies\` \`allergies\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`animalId\` \`animalId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`proprietaireId\` \`proprietaireId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`fiche_medicale\` CHANGE \`notes\` \`notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` DROP FOREIGN KEY \`FK_ad88301fdc79593dd222268a8b6\``);
        await queryRunner.query(`ALTER TABLE \`password_reset\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` ADD CONSTRAINT \`FK_1f5e23f7f31776c71c71195e69f\` FOREIGN KEY (\`cliniqueId\`) REFERENCES \`clinique\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` ADD CONSTRAINT \`FK_7bc363a2aee1cb987005fe84c5b\` FOREIGN KEY (\`veterinaire_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` ADD CONSTRAINT \`FK_00a91c89fd584b0a770b67c5879\` FOREIGN KEY (\`animalId\`) REFERENCES \`animal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` ADD CONSTRAINT \`FK_ad88301fdc79593dd222268a8b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_reset\` DROP FOREIGN KEY \`FK_ad88301fdc79593dd222268a8b6\``);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` DROP FOREIGN KEY \`FK_00a91c89fd584b0a770b67c5879\``);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` DROP FOREIGN KEY \`FK_7bc363a2aee1cb987005fe84c5b\``);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` DROP FOREIGN KEY \`FK_1f5e23f7f31776c71c71195e69f\``);
        await queryRunner.query(`ALTER TABLE \`password_reset\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` ADD CONSTRAINT \`FK_ad88301fdc79593dd222268a8b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`fiche_medicale\` CHANGE \`notes\` \`notes\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`proprietaireId\` \`proprietaireId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`animalId\` \`animalId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`allergies\` \`allergies\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`antecedants\` \`antecedants\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`observations\` \`observations\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` ADD CONSTRAINT \`FK_00a91c89fd584b0a770b67c5879\` FOREIGN KEY (\`animalId\`) REFERENCES \`animal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`clinique\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`clinique\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`clinique\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`DROP TABLE \`disponibilite\``);
    }

}
