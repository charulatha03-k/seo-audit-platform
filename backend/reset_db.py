import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__)))

from database.connection import engine, Base
from database import models

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Tables dropped successfully.")
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
