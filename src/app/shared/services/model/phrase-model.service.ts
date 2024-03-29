import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Phrase } from '../../model/phrase';
import { Reference } from '../../model/reference';

const QUERY_CREATE_PHRASES_TABLE =
  'CREATE TABLE IF NOT EXISTS PHRASES (id integer PRIMARY KEY,code_langue,phrase,reference_key);';
const QUERY_INSERT_PHRASES_INIT_TABLE =
  'INSERT OR REPLACE INTO PHRASES (id,code_langue,phrase,reference_key) VALUES (1,"fr","Prout",1),(2,"gb","Fart",1),(3,"fr","Beauf",2),(4,"gb","Redneck",2)';
const QUERY_GET_PHRASES_TABLE = 'SELECT * FROM PHRASES';
const QUERY_GET_PHRASES_FROM_REF_TABLE =
  'SELECT * FROM PHRASES WHERE reference_key=';
const QUERY_INSERT_PHRASES_TABLE =
  'INSERT OR REPLACE INTO PHRASES (code_langue,phrase,reference_key) VALUES ';
const QUERY_DELETE_PHRASES = 'DELETE FROM PHRASES WHERE reference_key=';

@Injectable({
  providedIn: 'root',
})
export class PhraseModelService {
  constructor() {}

  public createTable(db: SQLiteDBConnection) {
    return db
      .execute(QUERY_CREATE_PHRASES_TABLE)
      .catch((err) => console.log(err));
  }

  public insertPhraseInit(db: SQLiteDBConnection) {
    return db
      .execute(QUERY_INSERT_PHRASES_INIT_TABLE)
      .catch((err) => console.log(err));
  }

  public insertPhrase(
    db: SQLiteDBConnection,
    phrases: Phrase[],
    reference_key: number
  ) {
    if (reference_key >= 0) {
      const sqlValuesInsert: string = phrases
        .map(
          (phrase: Phrase) =>
            '("' +
            phrase.langue.code +
            '","' +
            phrase.phrase +
            '",' +
            reference_key +
            ')'
        )
        .join(',');
      return db
        .execute(QUERY_INSERT_PHRASES_TABLE + sqlValuesInsert)
        .catch((err) => console.log(err));
    }else{
      return Promise.reject();
    }
  }

  getPhrases(db: SQLiteDBConnection) {
    return db.query(QUERY_GET_PHRASES_TABLE).catch((err) => console.log(err));
  }

  deletePhrasesForReference(db: SQLiteDBConnection, reference: Reference) {
    return db
      .query(QUERY_DELETE_PHRASES + reference.id)
      .catch((err) => console.log(err));
  }

  getPhraseByReference(db: SQLiteDBConnection, ref: number | undefined) {
    return db
      .query(QUERY_GET_PHRASES_FROM_REF_TABLE + ref)
      .catch((err) => console.log(err));
  }
}
