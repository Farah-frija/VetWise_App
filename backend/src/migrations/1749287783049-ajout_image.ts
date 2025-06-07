import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutImage1749287783049 implements MigrationInterface {
    name = 'AjoutImage1749287783049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isRead\` tinyint NOT NULL DEFAULT 0, \`conversationId\` varchar(36) NULL, \`senderId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`meeting_session\` (\`id\` varchar(36) NOT NULL, \`actionTime\` timestamp NOT NULL, \`actionType\` enum ('join', 'leave') NOT NULL, \`conversationId\` varchar(36) NULL, \`participantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversation\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastMessageAt\` datetime NULL, \`participant1Id\` int NULL, \`participant2Id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` ADD \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`meeting_session\` ADD CONSTRAINT \`FK_067de86203083a330775e5628e8\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`meeting_session\` ADD CONSTRAINT \`FK_c6ba30424d3e845980129934ac6\` FOREIGN KEY (\`participantId\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_e2475466d8e2617f4c2d764e6d6\` FOREIGN KEY (\`participant1Id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_bf661acf9aacf61a5a6b7145ba2\` FOREIGN KEY (\`participant2Id\`) REFERENCES \`utilisateur\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_bf661acf9aacf61a5a6b7145ba2\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_e2475466d8e2617f4c2d764e6d6\``);
        await queryRunner.query(`ALTER TABLE \`meeting_session\` DROP FOREIGN KEY \`FK_c6ba30424d3e845980129934ac6\``);
        await queryRunner.query(`ALTER TABLE \`meeting_session\` DROP FOREIGN KEY \`FK_067de86203083a330775e5628e8\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``);
        await queryRunner.query(`ALTER TABLE \`utilisateur\` DROP COLUMN \`image\``);
        await queryRunner.query(`DROP TABLE \`conversation\``);
        await queryRunner.query(`DROP TABLE \`meeting_session\``);
        await queryRunner.query(`DROP TABLE \`message\``);
    }

}
