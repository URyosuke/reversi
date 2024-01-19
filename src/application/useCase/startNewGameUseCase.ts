import { connectMySQL } from "../../infrastructure/connection";
import { Game } from "../../domain/model/game/game";
import { GameMySQLRepository } from "../../infrastructure/repository/game/gameMySQLRepository";
import { firstTurn } from "../../domain/model/turn/turn";
import { TurnMySQLRepository } from "../../infrastructure/repository/turn/turnMySQLRepository";


export class StartNewGameUseCase {
  constructor(
    private _gameRepository: GameMySQLRepository,
    private _turnRepository: TurnMySQLRepository
  ){}
  async run() {
    const now = new Date();

    const conn = await connectMySQL();
    try {
      await conn.beginTransaction();

      const game = await this._gameRepository.save(conn, new Game(undefined, now));

      if (!game.id) {
        throw new Error("game.id not exist");
      }
      const turn = firstTurn(game.id, now);

      await this._turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
