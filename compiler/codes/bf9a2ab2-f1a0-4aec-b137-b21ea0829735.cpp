#include <iostream>
#include <chrono>
#include <thread>

int main() {
    while(true) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    return 0;
}