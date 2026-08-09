export const code = `\
\`\`\`rust

use std::fs; // Import file system utilities
use std::io::{self, Write}; // Import I/O utilities

/* Read file content into a string */
fn read_file(path: &str) -> io::Result<String> {
    fs::read_to_string(path) // Read file content into a String
}

fn main() {
    match read_file("example.txt") {
        Ok(content) => println!("File content:\n{}", content),
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}
\`\`\`
`
