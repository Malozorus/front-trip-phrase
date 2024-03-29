import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Country } from '../../model/country';
import { CustomTranslationService } from '../custom-translation.service';

const QUERY_CREATE_CONFIG_TABLE =
  'CREATE TABLE IF NOT EXISTS FAVORITES (id integer PRIMARY KEY,code_langue);';

const QUERY_INSERT_FAVORITES_TABLE =
  'INSERT INTO FAVORITES (code_langue) VALUES';

const QUERY_DELETE_FAVORITES_INIT_TABLE =
  'DELETE FROM FAVORITES WHERE code_langue=';

const QUERY_GET_FAVORITES_TABLE = 'SELECT * FROM FAVORITES';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  public favorites: Country[] = [];

  constructor(private customTranslationService: CustomTranslationService) {}

  initDataInsert(db: SQLiteDBConnection) {
    return db.query(QUERY_CREATE_CONFIG_TABLE).catch((err) => console.log(err));
  }

  deleteFavorite(db: SQLiteDBConnection, code_langue: string) {
    return db
      .query(QUERY_DELETE_FAVORITES_INIT_TABLE + '"' + code_langue + '"')
      .catch((err) => console.log(err));
  }

  insertFavorite(db: SQLiteDBConnection, code_langue: string) {
    return db
      .query(QUERY_INSERT_FAVORITES_TABLE + '("' + code_langue + '")')
      .catch((err) => console.log(err));
  }

  async getFavorites(db: SQLiteDBConnection) {
    const results: any = await db.query(QUERY_GET_FAVORITES_TABLE);
    this.favorites = results?.values.map((result: any) =>
      this.customTranslationService.getLangueObject(result.code_langue)
    );
    return db;
  }
}
