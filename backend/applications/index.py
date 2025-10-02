import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage ski team applications - submit, list, approve/reject
    Args: event with httpMethod, body, queryStringParameters
          context with request_id
    Returns: HTTP response with applications data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            cursor.execute('SELECT id, child_name, child_age, parent_name, phone, comment, status, created_at FROM applications ORDER BY created_at DESC')
            rows = cursor.fetchall()
            
            applications = []
            for row in rows:
                applications.append({
                    'id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'parent': row[3],
                    'phone': row[4],
                    'comment': row[5],
                    'status': row[6],
                    'createdAt': row[7].isoformat() if row[7] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'applications': applications}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            child_name = body_data.get('childName', '')
            child_age = body_data.get('childAge', 0)
            parent_name = body_data.get('parentName', '')
            phone = body_data.get('phone', '')
            comment = body_data.get('comment', '')
            
            cursor.execute(
                "INSERT INTO applications (child_name, child_age, parent_name, phone, comment) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (child_name, child_age, parent_name, phone, comment)
            )
            app_id = cursor.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': app_id, 'message': 'Application created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            app_id = body_data.get('id')
            status = body_data.get('status')
            
            cursor.execute(
                "UPDATE applications SET status = %s WHERE id = %s",
                (status, app_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Application updated'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
