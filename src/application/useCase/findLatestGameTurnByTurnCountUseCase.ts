import { connectMySQL } from "../../infrastructure/connection";
import { GameMySQLRepository } from "../../infrastructure/repository/game/gameMySQLRepository";
import { GameResultMySQLRepository } from "../../infrastructure/repository/gameResult/gameResultMySQLRepository";
import { Disc, toDisc } from "../../domain/model/turn/disc";
import { Point } from "../../domain/model/turn/point";
import { TurnMySQLRepository } from "../../infrastructure/repository/turn/turnMySQLRepository";
import { ApplicationError } from "../error/applicationError";
import { GameResult } from "../../domain/model/gameResult/gameResult";

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | undefined,
    private _winnerDisc: number | undefined
  ) {}

  get turnCount() {
    return this._turnCount;
  }

  get board() {
    return this._board;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

export class FindLatestGameTurnByTurnCountUseCase {
  constructor(
    private _turnRepository: TurnMySQLRepository,
    private _gameRepository: GameMySQLRepository,
    private _gameResultRepository: GameResultMySQLRepository
  ) {}
  
  async run(
    turnCount: number
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectMySQL();
    try {
      const game = await this._gameRepository.findLatest(conn);
      if (!game) {
        throw new ApplicationError(
          "LatestGameNotFound",
          "Latest game not found"
        );
      }
      if (!game.id) {
        throw new Error("game.id not exist");
      }

      const turn = await this._turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        turnCount
      );

      let gameResult: GameResult | undefined = undefined;
      if (turn.gameEnded()) {
        gameResult = await this._gameResultRepository.findForGameId(conn, game.id);
      }

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        gameResult?.winenrDisc
      );
    } finally {
      await conn.end();
    }
  }

  
}
