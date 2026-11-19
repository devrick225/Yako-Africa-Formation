import unittest
from app import response_for

class ServiceTests(unittest.TestCase):
    def test_health(self):
        status, body = response_for("/health")
        self.assertEqual(status, 200)
        self.assertEqual(body["status"], "ok")
    def test_business_contract(self):
        status, body = response_for("/api/services")
        self.assertEqual(status, 200)
        self.assertTrue(body["services"])
        self.assertTrue(body["services"][0]["actif"])
    def test_unknown_route(self):
        self.assertEqual(response_for("/inconnu")[0], 404)
    def test_incident(self):
        self.assertEqual(response_for("/api/services", fail=True)[0], 503)

if __name__ == "__main__":
    unittest.main()
