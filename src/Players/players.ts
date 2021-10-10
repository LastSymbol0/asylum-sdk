import { PublicKey } from '@solana/web3.js';
import { Program, web3 } from '@project-serum/anchor';


export type PlayerGlobalData = {
    nickname: string,
    avatar: PublicKey,
    games: PublicKey[],
    level: number,
    exp: number,
    achievements: number[]
}

export const findPlayerGlobalAccountAddress = (userPublicKey: PublicKey, programId: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddress([userPublicKey.toBuffer()], programId);
}

// TODO: add init and fetch player game acc functionality
export const findPlayerGameAccountAddress = (userPublicKey: PublicKey, gameId: PublicKey, programId: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddress([userPublicKey.toBuffer(), gameId.toBuffer()], programId);
}

export const initPlayer = async (program: Program, nickname: string = "CryptoBuddy77", avatar: PublicKey = PublicKey.default): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [playerAccount, nonce] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

    await program.rpc.initialize(nonce, nickname, avatar, {
      accounts: {
        playerAccount: playerAccount,
        user: userPublicKey,
        systemProgram: web3.SystemProgram.programId,
      }
    });
}

export const updatePlayerNickname = async (program: Program, nickname: string): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [playerAccount, _] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

    await program.rpc.updateNickname(nickname, {
      accounts: {
        playerAccount: playerAccount,
      }
    });
}

export const updatePlayerAvatar = async (program: Program, avatar: PublicKey): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [playerAccount, _] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

    await program.rpc.updateAvatar(avatar, {
      accounts: {
        playerAccount: playerAccount,
      }
    });
}

export const addGameToLibrary = async (program: Program, gameAddress: PublicKey): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [playerAccount, _] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

    await program.rpc.addGame(gameAddress, {
      accounts: {
        playerAccount: playerAccount,
      }
    });
}

export const removeGameFromLibrary = async (program: Program, gameAddress: PublicKey): Promise<void> => {
    const userPublicKey = program.provider.wallet.publicKey;
    const programId = program.programId;
    const [playerAccount, _] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

    await program.rpc.removeGame(gameAddress, {
      accounts: {
        playerAccount: playerAccount,
      }
    });
}

export const addAchievement = async (program: Program, achievementId: number, expToAdd: number = 0): Promise<void> => {
  const userPublicKey = program.provider.wallet.publicKey;
  const programId = program.programId;
  const [playerAccount, _] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

  await program.rpc.addAchievement(achievementId, expToAdd, {
    accounts: {
      playerAccount: playerAccount,
    }
  });
}

export const addExp = async (program: Program, exp: number): Promise<void> => {
  const userPublicKey = program.provider.wallet.publicKey;
  const programId = program.programId;
  const [playerAccount, _] = await findPlayerGlobalAccountAddress(userPublicKey, programId);

  await program.rpc.addExp(exp, {
    accounts: {
      playerAccount: playerAccount,
    }
  });
}