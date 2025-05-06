import {
  setValue,
  getValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
} from "../lib/kv-store"

async function testDatabaseIntegration() {
  console.log("🔍 Starting database integration test...")
  console.log("Testing connection to Redis KV store...")

  try {
    // Test 1: Basic set and get
    console.log("\n📝 Test 1: Basic set and get operations")
    const testKey = "test:integration:key"
    const testValue = { message: "Hello from test script", timestamp: new Date().toISOString() }

    console.log(`Setting value for key: ${testKey}`)
    await setValue(testKey, testValue)

    console.log("Getting value back...")
    const retrievedValue = await getValue(testKey)

    if (retrievedValue && retrievedValue.message === testValue.message) {
      console.log("✅ Basic set/get test passed!")
    } else {
      console.log("❌ Basic set/get test failed!")
      console.log("Expected:", testValue)
      console.log("Got:", retrievedValue)
    }

    // Test 2: Counter operations
    console.log("\n📝 Test 2: Counter operations")
    const counterKey = "test:integration:counter"

    console.log(`Incrementing counter: ${counterKey}`)
    const counterValue1 = await incrementCounter(counterKey)
    console.log(`Counter value after first increment: ${counterValue1}`)

    const counterValue2 = await incrementCounter(counterKey)
    console.log(`Counter value after second increment: ${counterValue2}`)

    if (counterValue2 === counterValue1 + 1) {
      console.log("✅ Counter test passed!")
    } else {
      console.log("❌ Counter test failed!")
      console.log(`Expected ${counterValue1 + 1}, got ${counterValue2}`)
    }

    // Test 3: Set operations
    console.log("\n📝 Test 3: Set operations")
    const setKey = "test:integration:set"

    console.log(`Adding items to set: ${setKey}`)
    await addToSet(setKey, "item1")
    await addToSet(setKey, "item2")
    await addToSet(setKey, "item3")

    console.log("Getting set members...")
    const setMembers = await getSetMembers(setKey)
    console.log("Set members:", setMembers)

    if (setMembers.includes("item1") && setMembers.includes("item2") && setMembers.includes("item3")) {
      console.log("✅ Set addition test passed!")
    } else {
      console.log("❌ Set addition test failed!")
    }

    console.log("Removing item from set...")
    await removeFromSet(setKey, "item2")

    const updatedSetMembers = await getSetMembers(setKey)
    console.log("Updated set members:", updatedSetMembers)

    if (
      updatedSetMembers.includes("item1") &&
      !updatedSetMembers.includes("item2") &&
      updatedSetMembers.includes("item3")
    ) {
      console.log("✅ Set removal test passed!")
    } else {
      console.log("❌ Set removal test failed!")
    }

    // Test 4: Multiple values
    console.log("\n📝 Test 4: Getting multiple values")
    const multiKey1 = "test:integration:multi1"
    const multiKey2 = "test:integration:multi2"

    await setValue(multiKey1, { id: 1, name: "Test 1" })
    await setValue(multiKey2, { id: 2, name: "Test 2" })

    const multiValues = await getMultipleValues([multiKey1, multiKey2])
    console.log("Multiple values:", multiValues)

    if (multiValues.length === 2 && multiValues[0]?.id === 1 && multiValues[1]?.id === 2) {
      console.log("✅ Multiple values test passed!")
    } else {
      console.log("❌ Multiple values test failed!")
    }

    // Test 5: Order repository test
    console.log("\n📝 Test 5: Testing order repository")
    try {
      const { RedisOrderRepository } = await import("../repositories/order-repository")
      const orderRepo = new RedisOrderRepository()

      console.log("Creating test order...")
      const testOrder = await orderRepo.createOrder({
        email: "test@example.com",
        items: [
          {
            id: "item_1",
            productId: "prod_1",
            variantId: "var_1",
            name: "Test Product",
            price: 19.99,
            quantity: 1,
          },
        ],
        subtotal: 19.99,
        tax: 1.99,
        shipping: 4.99,
        discount: 0,
        total: 26.97,
        currency: "USD",
        status: "pending",
        supplierId: "supplier_1",
      })

      console.log("Test order created:", testOrder.id)

      console.log("Retrieving order...")
      const retrievedOrder = await orderRepo.getOrderById(testOrder.id)

      if (retrievedOrder && retrievedOrder.id === testOrder.id) {
        console.log("✅ Order repository test passed!")
      } else {
        console.log("❌ Order repository test failed!")
      }

      console.log("Updating order status...")
      const updatedOrder = await orderRepo.updateOrderStatus(
        testOrder.id,
        "processing",
        "Status updated by test script",
      )

      if (updatedOrder && updatedOrder.status === "processing") {
        console.log("✅ Order status update test passed!")
      } else {
        console.log("❌ Order status update test failed!")
      }
    } catch (error) {
      console.error("Error testing order repository:", error)
      console.log("❌ Order repository test failed!")
    }

    console.log("\n🎉 Database integration tests completed!")
  } catch (error) {
    console.error("❌ Database integration test failed with error:", error)
  }
}

// Run the test
testDatabaseIntegration()
