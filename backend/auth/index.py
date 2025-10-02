import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Coach authentication and registration - login/register with username and password
    Args: event with httpMethod, body, pathParams
          context with request_id
    Returns: HTTP response with authentication result
    '''
    method: str = event.get('httpMethod', 'POST')
    path_params = event.get('pathParams', {})
    is_register = '/register' in event.get('requestContext', {}).get('http', {}).get('path', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        username = body_data.get('username', '')
        password = body_data.get('password', '')
        
        if is_register:
            full_name = body_data.get('fullName', '')
            
            if not username or not password or not full_name:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'message': 'Все поля обязательны для заполнения'
                    }),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "SELECT id FROM coaches WHERE username = '" + username + "'"
            )
            existing = cursor.fetchone()
            
            if existing:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'message': 'Пользователь с таким логином уже существует'
                    }),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "INSERT INTO coaches (username, password_hash, full_name) VALUES ('" + username + "', '" + password + "', '" + full_name + "')"
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Регистрация успешна'
                }),
                'isBase64Encoded': False
            }
        else:
            cursor.execute(
                "SELECT id, full_name FROM coaches WHERE username = '" + username + "' AND password_hash = '" + password + "'"
            )
            coach = cursor.fetchone()
            
            if coach:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'coach': {
                            'id': coach[0],
                            'name': coach[1]
                        }
                    }),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'message': 'Неверный логин или пароль'
                    }),
                    'isBase64Encoded': False
                }
    
    finally:
        cursor.close()
        conn.close()