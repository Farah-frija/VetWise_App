import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRdvEntity1746146814383 implements MigrationInterface {
    name = 'FixRdvEntity1746146814383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rendezvous\` ADD \`proprietaire_id\` int NULL`);
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
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` DROP FOREIGN KEY \`FK_00a91c89fd584b0a770b67c5879\``);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`observations\` \`observations\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`antecedants\` \`antecedants\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`allergies\` \`allergies\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`animalId\` \`animalId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` DROP FOREIGN KEY \`FK_245a088537113ca38b284656bce\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` DROP FOREIGN KEY \`FK_77d9414456ca95dc12e05c2f401\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` CHANGE \`rendezvous_id\` \`rendezvous_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` CHANGE \`animal_id\` \`animal_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` DROP FOREIGN KEY \`FK_fc5fd26981a9e5c9f8c8c494814\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`motif\` \`motif\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`notes\` \`notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`veterinaire_id\` \`veterinaire_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`proprietaireId\` \`proprietaireId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`clinique\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`clinique\` CHANGE \`coordonneesGPS\` \`coordonneesGPS\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` DROP FOREIGN KEY \`FK_7bc363a2aee1cb987005fe84c5b\``);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` CHANGE \`dateExceptionnelle\` \`dateExceptionnelle\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` CHANGE \`veterinaire_id\` \`veterinaire_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`fiche_medicale\` CHANGE \`notes\` \`notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` DROP FOREIGN KEY \`FK_ad88301fdc79593dd222268a8b6\``);
        await queryRunner.query(`ALTER TABLE \`password_reset\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` ADD CONSTRAINT \`FK_1f5e23f7f31776c71c71195e69f\` FOREIGN KEY (\`cliniqueId\`) REFERENCES \`clinique\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` ADD CONSTRAINT \`FK_00a91c89fd584b0a770b67c5879\` FOREIGN KEY (\`animalId\`) REFERENCES \`animal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` ADD CONSTRAINT \`FK_245a088537113ca38b284656bce\` FOREIGN KEY (\`rendezvous_id\`) REFERENCES \`rendezvous\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` ADD CONSTRAINT \`FK_77d9414456ca95dc12e05c2f401\` FOREIGN KEY (\`animal_id\`) REFERENCES \`animal\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` ADD CONSTRAINT \`FK_fc5fd26981a9e5c9f8c8c494814\` FOREIGN KEY (\`veterinaire_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` ADD CONSTRAINT \`FK_173ee5bc6714dcc6aa0a4bd5a08\` FOREIGN KEY (\`proprietaire_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` ADD CONSTRAINT \`FK_7bc363a2aee1cb987005fe84c5b\` FOREIGN KEY (\`veterinaire_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` ADD CONSTRAINT \`FK_ad88301fdc79593dd222268a8b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_reset\` DROP FOREIGN KEY \`FK_ad88301fdc79593dd222268a8b6\``);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` DROP FOREIGN KEY \`FK_7bc363a2aee1cb987005fe84c5b\``);
        await queryRunner.query(`ALTER TABLE \`animal\` DROP FOREIGN KEY \`FK_ea0cfb88c0ae9531a44fedb98c4\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` DROP FOREIGN KEY \`FK_173ee5bc6714dcc6aa0a4bd5a08\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` DROP FOREIGN KEY \`FK_fc5fd26981a9e5c9f8c8c494814\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` DROP FOREIGN KEY \`FK_77d9414456ca95dc12e05c2f401\``);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` DROP FOREIGN KEY \`FK_245a088537113ca38b284656bce\``);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` DROP FOREIGN KEY \`FK_00a91c89fd584b0a770b67c5879\``);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` DROP FOREIGN KEY \`FK_1f5e23f7f31776c71c71195e69f\``);
        await queryRunner.query(`ALTER TABLE \`password_reset\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`password_reset\` ADD CONSTRAINT \`FK_ad88301fdc79593dd222268a8b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`fiche_medicale\` CHANGE \`notes\` \`notes\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` CHANGE \`veterinaire_id\` \`veterinaire_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` CHANGE \`dateExceptionnelle\` \`dateExceptionnelle\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`disponibilite\` ADD CONSTRAINT \`FK_7bc363a2aee1cb987005fe84c5b\` FOREIGN KEY (\`veterinaire_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clinique\` CHANGE \`coordonneesGPS\` \`coordonneesGPS\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`clinique\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`proprietaireId\` \`proprietaireId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`animal\` ADD CONSTRAINT \`FK_ea0cfb88c0ae9531a44fedb98c4\` FOREIGN KEY (\`proprietaireId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`veterinaire_id\` \`veterinaire_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`notes\` \`notes\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`motif\` \`motif\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous\` ADD CONSTRAINT \`FK_fc5fd26981a9e5c9f8c8c494814\` FOREIGN KEY (\`veterinaire_id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` CHANGE \`animal_id\` \`animal_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` CHANGE \`rendezvous_id\` \`rendezvous_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` ADD CONSTRAINT \`FK_77d9414456ca95dc12e05c2f401\` FOREIGN KEY (\`animal_id\`) REFERENCES \`animal\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rendezvous_animaux\` ADD CONSTRAINT \`FK_245a088537113ca38b284656bce\` FOREIGN KEY (\`rendezvous_id\`) REFERENCES \`rendezvous\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`animalId\` \`animalId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`allergies\` \`allergies\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`antecedants\` \`antecedants\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`observations\` \`observations\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`dossier_medical\` ADD CONSTRAINT \`FK_00a91c89fd584b0a770b67c5879\` FOREIGN KEY (\`animalId\`) REFERENCES \`animal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE \`rendezvous\` DROP COLUMN \`proprietaire_id\``);
    }

}
