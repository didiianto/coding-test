import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app  # Assuming the FastAPI app is in 'main.py'

# Fixture to create the TestClient
@pytest.fixture
def client():
    return TestClient(app)

# Unit test for the /api/data endpoint
def test_get_data(client):
    response = client.get("/api/data")
    assert response.status_code == 200
    # Assert that the response contains a key "salesReps" which is a list
    response_data = response.json()
    assert isinstance(response_data.get("salesReps"), list)  # Check that "salesReps" is a list
    assert len(response_data["salesReps"]) > 0  # Ensure there's at least one sales rep

    # Optional: Check that the first item in "salesReps" contains the expected fields
    first_sales_rep = response_data["salesReps"][0]
    assert "id" in first_sales_rep
    assert "name" in first_sales_rep
    assert "role" in first_sales_rep

# Integration test for the /api/data endpoint
def test_get_data_integration(client):
    """
    Test the /api/data endpoint to check if the integration works end-to-end.
    """
    response = client.get("/api/data")
    
    assert response.status_code == 200
    
    # Assert that the response contains a 'salesReps' key and that it's a list
    response_data = response.json()  # This will be a dictionary with the 'salesReps' key
    assert isinstance(response_data.get("salesReps"), list)  # Check that 'salesReps' is a list
    
    # Assert that the list under 'salesReps' contains at least one item
    assert len(response_data["salesReps"]) > 0

    # Optionally, check that the first item in the 'salesReps' list contains the expected fields
    first_sales_rep = response_data["salesReps"][0]
    assert "id" in first_sales_rep
    assert "name" in first_sales_rep
    assert "role" in first_sales_rep