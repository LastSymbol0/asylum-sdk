import { PublicKey } from '@solana/web3.js';
import { Provider, Program, Idl } from '@project-serum/anchor'
import playersIdl from '../idl/players.json'
import * as players from './players';

export const playersProgramID = new PublicKey(playersIdl.metadata.address)

export interface PlayersProgram {
    findPlayerGlobalAccountAddress(userPublicKey: PublicKey): Promise<[PublicKey, number]>
    // TODO: add init and fetch player game acc functionality
    findPlayerGameAccountAddress(userPublicKey: PublicKey, gameId: PublicKey): Promise<[PublicKey, number]>
    fetchPlayerGlobalAccountData(userPublicKey: PublicKey): Promise<players.PlayerGlobalData>
    updatePlayerNickname(nickname: string): Promise<void>
    updatePlayerAvatar(avatar: PublicKey): Promise<void>
    addAchievement(achievementId: number, expToAdd: number): Promise<void>
    addExp(exp: number): Promise<void>
}

export class PlayersProgram implements PlayersProgram
{
    program: Program;

    constructor(provider: Provider)
    {
        this.program = new Program(playersIdl as Idl, playersProgramID, provider)
    }

    findPlayerGlobalAccountAddress(userPublicKey: PublicKey): Promise<[PublicKey, number]> {
        return players.findPlayerGlobalAccountAddress(userPublicKey, this.program.programId)
    }

    findPlayerGameAccountAddress(userPublicKey: PublicKey, gameId: PublicKey): Promise<[PublicKey, number]> {
        return players.findPlayerGameAccountAddress(userPublicKey, gameId, this.program.programId)
    }

    async fetchPlayerGlobalAccountData(userPublicKey: PublicKey): Promise<players.PlayerGlobalData> {
        try {
            const [playerAccountAddress, _] = await this.findPlayerGlobalAccountAddress(userPublicKey)
            const account = await this.program.account.playerAccount.fetch(playerAccountAddress)

            return account as players.PlayerGlobalData;
        } catch (err) {
            console.log("Player data fetching error: ", err)
            throw err
        }
    }

    async updatePlayerNickname(nickname: string): Promise<void> {
        return players.updatePlayerNickname(this.program, nickname)
    }

    async updatePlayerAvatar(avatar: PublicKey): Promise<void> {
        return players.updatePlayerAvatar(this.program, avatar)
    }

    async addAchievement(achievementId: number, expToAdd: number = 0): Promise<void> {
        return players.addAchievement(this.program, achievementId, expToAdd)
    }

    async addExp(exp: number): Promise<void> {
        return players.addExp(this.program, exp)
    }
}