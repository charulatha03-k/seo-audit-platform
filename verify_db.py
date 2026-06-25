from sqlalchemy import create_engine, inspect
import os

env_path = os.path.abspath(os.path.join('.env'))
with open(env_path) as f:
    lines = f.readlines()
db_url = next(line.split('=')[1].strip() for line in lines if line.startswith('DATABASE_URL'))

engine = create_engine(db_url)
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tables in DB: {tables}")
