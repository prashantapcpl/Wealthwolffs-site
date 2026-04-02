import requests
import sys
import json
from datetime import datetime

class WealthwolffsAPITester:
    def __init__(self, base_url="https://unified-kyc-platform.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "status": "PASSED" if success else "FAILED",
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if success:
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        details += f", Items: {len(response_data)}"
                    elif isinstance(response_data, dict):
                        details += f", Keys: {list(response_data.keys())}"
                except:
                    details += ", Response: Non-JSON"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f", Response: {response.text[:100]}"

            self.log_test(name, success, details)
            return success, response.json() if success else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_public_endpoints(self):
        """Test public endpoints that don't require authentication"""
        print("\n" + "="*50)
        print("TESTING PUBLIC ENDPOINTS")
        print("="*50)
        
        # Test testimonials endpoint
        self.run_test(
            "GET Testimonials",
            "GET",
            "testimonials",
            200
        )
        
        # Test news endpoint
        self.run_test(
            "GET News/Media",
            "GET", 
            "news",
            200
        )
        
        # Test contact form submission
        test_enquiry = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": f"test.{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "+91 9876543210",
            "message": "This is a test enquiry from automated testing."
        }
        
        success, response = self.run_test(
            "POST Contact Enquiry",
            "POST",
            "enquiries",
            200,
            data=test_enquiry
        )
        
        if success and 'enquiry_id' in response:
            print(f"   Created enquiry ID: {response['enquiry_id']}")
            return response['enquiry_id']
        
        return None

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTH ENDPOINTS")
        print("="*50)
        
        # Test auth/me without token (should fail)
        self.run_test(
            "GET Auth Me (No Token)",
            "GET",
            "auth/me",
            401
        )
        
        # Test logout without token
        self.run_test(
            "POST Logout (No Token)",
            "POST",
            "auth/logout",
            200  # Logout should work even without token
        )

    def test_admin_endpoints_without_auth(self):
        """Test admin endpoints without authentication (should fail)"""
        print("\n" + "="*50)
        print("TESTING ADMIN ENDPOINTS (NO AUTH - SHOULD FAIL)")
        print("="*50)
        
        # Test admin stats without auth
        self.run_test(
            "GET Admin Stats (No Auth)",
            "GET",
            "admin/stats",
            401
        )
        
        # Test admin users without auth
        self.run_test(
            "GET Admin Users (No Auth)",
            "GET",
            "admin/users",
            401
        )
        
        # Test admin enquiries without auth
        self.run_test(
            "GET Admin Enquiries (No Auth)",
            "GET",
            "admin/enquiries",
            401
        )

    def test_hidden_pages(self):
        """Test hidden pages endpoint"""
        print("\n" + "="*50)
        print("TESTING HIDDEN PAGES")
        print("="*50)
        
        # Test getting a non-existent page
        self.run_test(
            "GET Hidden Page (Non-existent)",
            "GET",
            "pages/nonexistent123",
            404
        )

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_run - self.tests_passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAILED":
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting Wealthwolffs API Testing...")
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = WealthwolffsAPITester()
    
    # Run all test suites
    enquiry_id = tester.test_public_endpoints()
    tester.test_auth_endpoints()
    tester.test_admin_endpoints_without_auth()
    tester.test_hidden_pages()
    
    # Print final summary
    success = tester.print_summary()
    
    # Save test results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": tester.tests_passed/tester.tests_run*100,
            "test_results": tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())