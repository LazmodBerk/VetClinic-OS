from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    # Test if the app successfully mounts and responds to a basic endpoint
    # Since we have /api/v1, let's test a generic non-auth route or just 404
    response = client.get("/")
    assert response.status_code == 404 # Root doesn't exist, which is expected

def test_docs_reachable():
    response = client.get("/docs")
    assert response.status_code == 200
