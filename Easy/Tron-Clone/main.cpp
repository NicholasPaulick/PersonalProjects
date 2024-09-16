#include <SDL2/SDL.h>
#include <vector>
#include <deque>
#include <algorithm>

const int WINDOW_WIDTH = 800;
const int WINDOW_HEIGHT = 600;
const int PLAYER_SPEED = 5;
const int MAX_TRAIL_LENGTH = 1000;

struct Player {
    SDL_Rect rect;
    SDL_Point direction;
    std::deque<SDL_Rect> trail;
    int health;
};

bool checkCollision(const SDL_Rect& a, const SDL_Rect& b) {
    return !(a.x >= b.x + b.w || a.x + a.w <= b.x || a.y >= b.y + b.h || a.y + a.h <= b.y);
}

bool checkTrailCollision(const Player& player, const std::deque<SDL_Rect>& trail) {
    SDL_Rect playerHead = { player.rect.x, player.rect.y, player.rect.w, player.rect.h };
    for (const auto& rect : trail) {
        if (checkCollision(playerHead, rect)) {
            return true;
        }
    }
    return false;
}

void updatePlayerPosition(Player& player) {
    player.rect.x += player.direction.x * PLAYER_SPEED;
    player.rect.y += player.direction.y * PLAYER_SPEED;

    // Wall collision
    if (player.rect.x < 0) {
        player.rect.x = 0;
    }
    if (player.rect.x + player.rect.w > WINDOW_WIDTH) {
        player.rect.x = WINDOW_WIDTH - player.rect.w;
    }
    if (player.rect.y < 0) {
        player.rect.y = 0;
    }
    if (player.rect.y + player.rect.h > WINDOW_HEIGHT) {
        player.rect.y = WINDOW_HEIGHT - player.rect.h;
    }

    // Update trail
    player.trail.push_front(player.rect);
    if (player.trail.size() > MAX_TRAIL_LENGTH) {
        player.trail.pop_back();
    }

    // Check for self-collision (excluding the latest trail segment)
    for (size_t i = 1; i < player.trail.size(); ++i) {
        if (checkCollision(player.rect, player.trail[i])) {
            player.health = 0;
            break;
        }
    }
}

int main(int argc, char* argv[]) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
        return 1;
    }

    SDL_Window* window = SDL_CreateWindow("Tron", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, WINDOW_WIDTH, WINDOW_HEIGHT, SDL_WINDOW_SHOWN);
    if (window == nullptr) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Window could not be created! SDL_Error: %s\n", SDL_GetError());
        return 1;
    }

    SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (renderer == nullptr) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Renderer could not be created! SDL_Error: %s\n", SDL_GetError());
        return 1;
    }

    Player player1, player2;
    player1.rect = { 100, 300, 5, 5 };
    player1.direction = { 1, 0 };
    player1.health = 100;

    player2.rect = { 700, 300, 5, 5 };
    player2.direction = { -1, 0 };
    player2.health = 100;

    bool quit = false;
    SDL_Event event;

    Uint32 lastTime = SDL_GetTicks();

    while (!quit) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                quit = true;
            }
        }

        Uint32 currentTime = SDL_GetTicks();
        float deltaTime = (currentTime - lastTime) / 1000.0f;
        lastTime = currentTime;

        // Update player positions and self-collision checks
        updatePlayerPosition(player1);
        updatePlayerPosition(player2);

        // Check inter-player collisions and wall collisions
        if ((player1.health <= 0 || player2.health <= 0) ||
            checkTrailCollision(player1, player2.trail) || checkTrailCollision(player2, player1.trail) ||
            checkCollision(player1.rect, player2.rect)) {
            quit = true;
        }

        // Handle player input
        const Uint8* keyboardState = SDL_GetKeyboardState(nullptr);
        if (keyboardState[SDL_SCANCODE_W] && player1.direction.y == 0) player1.direction = { 0, -1 };
        if (keyboardState[SDL_SCANCODE_S] && player1.direction.y == 0) player1.direction = { 0, 1 };
        if (keyboardState[SDL_SCANCODE_A] && player1.direction.x == 0) player1.direction = { -1, 0 };
        if (keyboardState[SDL_SCANCODE_D] && player1.direction.x == 0) player1.direction = { 1, 0 };

        if (keyboardState[SDL_SCANCODE_UP] && player2.direction.y == 0) player2.direction = { 0, -1 };
        if (keyboardState[SDL_SCANCODE_DOWN] && player2.direction.y == 0) player2.direction = { 0, 1 };
        if (keyboardState[SDL_SCANCODE_LEFT] && player2.direction.x == 0) player2.direction = { -1, 0 };
        if (keyboardState[SDL_SCANCODE_RIGHT] && player2.direction.x == 0) player2.direction = { 1, 0 };

        // Clear the renderer
        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
        SDL_RenderClear(renderer);

        // Draw player trails
        SDL_SetRenderDrawColor(renderer, 0, 0, 255, 255);
        for (const auto& rect : player1.trail) {
            SDL_RenderFillRect(renderer, &rect);
        }
        SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
        for (const auto& rect : player2.trail) {
            SDL_RenderFillRect(renderer, &rect);
        }

        // Draw players
        SDL_SetRenderDrawColor(renderer, 0, 0, 255, 255);
        SDL_RenderFillRect(renderer, &player1.rect);
        SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
        SDL_RenderFillRect(renderer, &player2.rect);

        // Present the renderer
        SDL_RenderPresent(renderer);

        // Cap the frame rate
        SDL_Delay(16);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}