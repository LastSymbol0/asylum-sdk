import { PublicKey } from '@solana/web3.js';
import { Provider, Program, Idl } from '@project-serum/anchor'
import asylumIdl from '../idl/asylum.json'
import * as asylum from './asylum';

export const asylumProgramID = new PublicKey(asylumIdl.metadata.address)

export interface AsylumProgramm {
    findAchievementsAccountAddress(): Promise<[PublicKey, number]>
    fetchAcievementsData(game: PublicKey): Promise<asylum.AchievementData[]>
    addAchievement(label: String, description: String, game: PublicKey): Promise<void>
}

export class AsylumProgram implements AsylumProgram
{
    program: Program;

    constructor(provider: Provider)
    {
        this.program = new Program(asylumIdl as Idl, asylumProgramID, provider)
    }

    findAchievementsAccountAddress(): Promise<[PublicKey, number]> {
        return asylum.findAchievementsAccountAddress(this.program.programId);
    }

    async fetchAcievementsData(game: PublicKey): Promise<asylum.AchievementData[]> {
        try {
            const [achievementsAccountAddress, _] = await this.findAchievementsAccountAddress()
            const account = await this.program.account.achievementsAccount.fetch(achievementsAccountAddress)

            return account.achievements
              .filter((x: asylum.AchievementData) => x.game.toString() === game.toString());
        } catch (err) {
            console.log("Achievements data fetching error: ", err)
            throw err
        }
    }

    addAchievement(label: String, description: String, game: PublicKey): Promise<void> {
        return asylum.addAchievement(this.program, label, description, game);
    }
}