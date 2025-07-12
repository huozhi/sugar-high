export const code = `\
\`\`\`python
"""
This is a multi-line comment.
Demonstrating functions, loops, and type hints.
"""

def factorial(n: int) -> int:
    """Compute the factorial of a number."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial(5)) # Output: 120
\`\`\`
`
