import mysql from "mysql2/promise";
import { GameResultGateway } from "../../../infrastructure/repository/gameResult/gameResultGateway";
import { GameResult } from "./gameResult";
import { toWinnerDisc } from "./winnerDisc";

export interface GameResultRepository {
  findForGameId(
    conn: mysql.Connection,
    gameId: number
  ): Promise<GameResult | undefined>;

  save(conn: mysql.Connection, gameResult: GameResult): Promise<void>;
}
