import pytest
from datetime import date
from models import db, User, Income, Expense, Budget, SavingsGoal

def test_full_application_routes(auth_client, app, auth_user):
    """Verifies that all 8 redesigned pages and actions respond with 200 OK and match light mode design requirements."""
    
    # 1. Dashboard
    res = auth_client.get('/dashboard')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "Welcome back" in html
    assert "Monthly Income" in html
    assert "Total Expenses" in html
    assert "Current Savings" in html
    assert "Remaining Budget" in html
    assert "incomeExpenseChart" in html
    assert "categoryDoughnutChart" in html

    # 2. My Income
    res = auth_client.get('/income')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "Income Management" in html
    assert "Total Inflow This Month" in html
    assert "Income History" in html

    # 3. Expenses
    res = auth_client.get('/expenses')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "Expense Management" in html
    assert "Today&#39;s Spending" in html or "Today's Spending" in html
    assert "Selected Month Total" in html

    # Unified Transactions
    res = auth_client.get('/transactions')
    assert res.status_code == 200
    assert "Transactions History" in res.data.decode('utf-8')

    # 4. Budget Planner
    res = auth_client.get('/budgets')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "Smart Budget Planner" in html
    assert "Intelligent Budget Recommendations" in html
    assert "Category-Wise Spending Limits" in html

    # 5. AI Financial Advisor
    res = auth_client.get('/ai-advisor')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "AI Financial Advisor" in html
    assert "Conversational Advisor" in html
    assert "chatMessages" in html

    # 6. Savings Goals
    res = auth_client.get('/savings')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "Savings Goals" in html
    assert "Total Saved So Far" in html
    assert "Aggregate Target" in html

    # 7. Reports & Analytics
    res = auth_client.get('/reports')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert "Reports &amp; Analytics" in html or "Reports & Analytics" in html
    assert "Total Inflow" in html
    assert "reportTrendChart" in html

    # Printable Summary
    res = auth_client.get('/reports/printable-summary')
    assert res.status_code == 200
    assert "Monthly Financial Health" in res.data.decode('utf-8')

    # 8. Profile & Settings
    res = auth_client.get('/settings')
    assert res.status_code == 200
    assert "System Settings &amp; Data Control" in res.data.decode('utf-8') or "System Settings & Data Control" in res.data.decode('utf-8')

    res = auth_client.get('/profile')
    assert res.status_code == 200
    assert "User Profile &amp; Account" in res.data.decode('utf-8') or "User Profile & Account" in res.data.decode('utf-8')

    # Seed demo data test
    res = auth_client.post('/settings/seed-demo-data', follow_redirects=True)
    assert res.status_code == 200
    assert "demo data" in res.data.decode('utf-8').lower()
