import { PublicKey } from '@solana/web3.js';
import { Program, web3 } from '@project-serum/anchor';

export type AchievementData = {
    id: number,
    label: string,
    description: string,
    game: PublicKey,
}

export const findAchievementsAccountAddress = (programId: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddress([Buffer.from("Achievements")], programId);
}

export const findGamesCatalogAccountAddress = (programId: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddress([Buffer.from("GamesCatalog")], programId);
}


export const initAsylumAccounts = async (program: Program): Promise<void> => {
    await Promise.all([initAchievementsAccount(program), initGamesCatalogAccount(program)])
}

export const initAchievementsAccount = async (program: Program): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [account, nonce] = await findAchievementsAccountAddress(programId);

    await program.rpc.initializeAchievements(nonce, {
      accounts: {
        achievementsAccount: account,
        user: userPublicKey,
        systemProgram: web3.SystemProgram.programId,
      }
    });
}

export const addAchievement = async (program: Program, label: String, description: String, game: PublicKey): Promise<void> => {
    const programId = program.programId;
    const [account, _] = await findAchievementsAccountAddress(programId);

    await program.rpc.addAchievement(label, description, game, {
      accounts: {
        achievementsAccount: account,
      }
    });
}

export const initGamesCatalogAccount = async (program: Program): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [account, nonce] = await findGamesCatalogAccountAddress(programId);

    await program.rpc.initializeGamesCatalog(nonce, {
      accounts: {
        gamesCatalogAccount: account,
        user: userPublicKey,
        systemProgram: web3.SystemProgram.programId,
      }
    });
}

export const addGameToCatalog = async (program: Program, game: PublicKey): Promise<void> => {
    const programId = program.programId;
    const [account, _] = await findAchievementsAccountAddress(programId);

    await program.rpc.addGameToCatalog(game, {
      accounts: {
        gamesCatalogAccount: account,
      }
    });
}

