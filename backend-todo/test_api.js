const app = require('./src/app');
const http = require('http');

let server;
const PORT = 5001; // Use port 5001 for automated test to avoid conflicts

async function runTests() {
  console.log('🧪 Starting API Verification Suite...');

  server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}/api`;

  try {
    // 1. Health check
    console.log('\n--- Test 1: Health Check (GET /api/health) ---');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('Status:', healthRes.status, healthData);
    if (!healthData.success || healthRes.status !== 200) {
      throw new Error('Health check failed');
    }

    // 2. Register User A
    const userAEmail = `user_a_${Date.now()}@example.com`;
    console.log(`\n--- Test 2: Register User A (${userAEmail}) ---`);
    const regResA = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User A',
        email: userAEmail,
        password: 'Password123'
      })
    });
    const regDataA = await regResA.json();
    console.log('Status:', regResA.status, regDataA);
    if (regResA.status !== 201 || !regDataA.data?.token) {
      throw new Error('Registration failed for User A');
    }
    const tokenA = regDataA.data.token;
    const userIdA = regDataA.data.user.id;

    // 3. Register Duplicate Email (Expect 409 Conflict)
    console.log('\n--- Test 3: Duplicate Registration (Expect 409) ---');
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate',
        email: userAEmail,
        password: 'Password123'
      })
    });
    const dupData = await dupRes.json();
    console.log('Status:', dupRes.status, dupData);
    if (dupRes.status !== 409 || dupData.success !== false) {
      throw new Error('Expected 409 conflict on duplicate email');
    }

    // 4. Login User A
    console.log('\n--- Test 4: Login User A ---');
    const loginResA = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userAEmail,
        password: 'Password123'
      })
    });
    const loginDataA = await loginResA.json();
    console.log('Status:', loginResA.status, loginDataA);
    if (loginResA.status !== 200 || !loginDataA.data?.token) {
      throw new Error('Login failed for User A');
    }

    // 5. Get Current User (GET /api/auth/me)
    console.log('\n--- Test 5: Get Current User (GET /api/auth/me) ---');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const meData = await meRes.json();
    console.log('Status:', meRes.status, meData);
    if (meRes.status !== 200 || meData.data?.user?.id !== userIdA) {
      throw new Error('Get current user failed');
    }

    // 6. Create Todo for User A
    console.log('\n--- Test 6: Create Todo for User A ---');
    const createTodoRes = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Learn Node.js and Express MVC',
        description: 'Implement controllers, models, and services'
      })
    });
    const createTodoData = await createTodoRes.json();
    console.log('Status:', createTodoRes.status, createTodoData);
    if (createTodoRes.status !== 201 || !createTodoData.data?.todo?.id) {
      throw new Error('Create todo failed');
    }
    const todoIdA = createTodoData.data.todo.id;

    // 7. Get Todos for User A
    console.log('\n--- Test 7: Get Todos for User A ---');
    const getTodosRes = await fetch(`${baseUrl}/todos`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const getTodosData = await getTodosRes.json();
    console.log('Status:', getTodosRes.status, getTodosData);
    if (getTodosRes.status !== 200 || getTodosData.data.todos.length !== 1) {
      throw new Error('Get todos failed');
    }

    // 8. Register User B
    const userBEmail = `user_b_${Date.now()}@example.com`;
    console.log(`\n--- Test 8: Register User B (${userBEmail}) ---`);
    const regResB = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User B',
        email: userBEmail,
        password: 'Password456'
      })
    });
    const regDataB = await regResB.json();
    const tokenB = regDataB.data.token;

    // 9. Cross-User Security Test: User B attempts to access User A's todo
    console.log("\n--- Test 9: Cross-User Security Test (User B accessing User A's todo, Expect 404) ---");
    const crossGetRes = await fetch(`${baseUrl}/todos/${todoIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const crossGetData = await crossGetRes.json();
    console.log('Status:', crossGetRes.status, crossGetData);
    if (crossGetRes.status !== 404) {
      throw new Error('Security failure: User B was able to view User A todo!');
    }

    // 10. Cross-User Security Test: User B attempts to update User A's todo
    console.log("\n--- Test 10: Cross-User Security Test (User B updating User A's todo, Expect 404) ---");
    const crossUpdateRes = await fetch(`${baseUrl}/todos/${todoIdA}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({ title: 'Hacked by User B' })
    });
    const crossUpdateData = await crossUpdateRes.json();
    console.log('Status:', crossUpdateRes.status, crossUpdateData);
    if (crossUpdateRes.status !== 404) {
      throw new Error('Security failure: User B was able to modify User A todo!');
    }

    // 11. Cross-User Security Test: User B attempts to delete User A's todo
    console.log("\n--- Test 11: Cross-User Security Test (User B deleting User A's todo, Expect 404) ---");
    const crossDeleteRes = await fetch(`${baseUrl}/todos/${todoIdA}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const crossDeleteData = await crossDeleteRes.json();
    console.log('Status:', crossDeleteRes.status, crossDeleteData);
    if (crossDeleteRes.status !== 404) {
      throw new Error('Security failure: User B was able to delete User A todo!');
    }

    // 12. Update Todo by Owner (User A)
    console.log("\n--- Test 12: Update Todo by Owner (User A) ---");
    const updateRes = await fetch(`${baseUrl}/todos/${todoIdA}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Master React & Node.js Architecture',
        completed: true
      })
    });
    const updateData = await updateRes.json();
    console.log('Status:', updateRes.status, updateData);
    if (updateRes.status !== 200 || updateData.data.todo.completed !== true) {
      throw new Error('Update todo by owner failed');
    }

    // 13. Delete Todo by Owner (User A)
    console.log("\n--- Test 13: Delete Todo by Owner (User A) ---");
    const deleteRes = await fetch(`${baseUrl}/todos/${todoIdA}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const deleteData = await deleteRes.json();
    console.log('Status:', deleteRes.status, deleteData);
    if (deleteRes.status !== 200 || deleteData.success !== true) {
      throw new Error('Delete todo by owner failed');
    }

    console.log('\n=============================================');
    console.log('🎉 ALL 13 BACKEND API TESTS PASSED PERFECTLY!');
    console.log('=============================================\n');
  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests();
