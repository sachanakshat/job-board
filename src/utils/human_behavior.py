import asyncio
import random
import logging

logger = logging.getLogger(__name__)

async def human_like_delay():
    """Add random delay to simulate human behavior."""
    await asyncio.sleep(random.uniform(1.5, 3.5))

async def human_like_mouse_movement(page, element):
    """Simulate human-like mouse movement to an element."""
    # Get element position
    box = await element.bounding_box()
    if not box:
        return
    
    # Move mouse in a natural curve
    current_x, current_y = 0, 0
    target_x, target_y = box['x'] + box['width']/2, box['y'] + box['height']/2
    
    # Create a curved path
    steps = random.randint(10, 20)
    for i in range(steps):
        progress = i / steps
        # Add some randomness to the curve
        curve_x = current_x + (target_x - current_x) * progress + random.uniform(-10, 10)
        curve_y = current_y + (target_y - current_y) * progress + random.uniform(-10, 10)
        await page.mouse.move(curve_x, curve_y)
        await asyncio.sleep(random.uniform(0.01, 0.03)) 