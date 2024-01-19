import mysql from "mysql2/promise";
import { MoveGateway } from "../../../infrastructure/moveGateway";
import { SquareGateway } from "../../../infrastructure/squareGateway";
import { TurnGateway } from "../../../infrastructure/repository/turn/turnGateway";
import { DomainError } from "../../error/domainError";
import { Board } from "./board";
import { toDisc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";
import { Turn } from "./turn";

const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

export interface TurnRepository {
  findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number
  ): Promise<Turn>;

  save(conn: mysql.Connection, turn: Turn): Promise<void>;
}
