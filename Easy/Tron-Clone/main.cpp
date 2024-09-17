#include <SDL2/SDL.h>
#include <SDL2/SDL_ttf.h>
#include <vector>
#include <deque>
#include <algorithm>

const int WINDOW_WIDTH = 800;
const int WINDOW_HEIGHT = 600;
const int PLAYER_SPEED = 5;
const int MAX_TRAIL_LENGTH = 1000;

enum GameState { MENU, PLAYING, PAUSED, GAMEOVER };

struct Player {
    SDL_Rect rect;
    SDL_Point direction;
    std::deque<SDL_Rect> trail;
    int health;
    SDL_Color color;
};

bool checkCollision(const SDL_Rect& a, const SDL_Rect& b) {
    return !(a.x >= b.x + b.w || a.x + a.w <= b.x || a.y >= b.y + b.h || a.y + a.h <= b.y);
}

bool checkTrailCollision(const Player& player, const std::deque<SDL_Rect>& trail) {
    SDL_Rect playerHead = { player.rect.x + player.direction.x * player.rect.w / 2, 
                             player.rect.y + player.direction.y * player.rect.h / 2,
                             player.rect.w / 2, 
                             player.rect.h / 2 };
    int count = 0;
    for (const auto& rect : trail) {
        if (count != 0){
            if (checkCollision(playerHead, rect)) {
                return true;
            }
        }
        count++;
    }
    return false;
}

void updatePlayerPosition(Player& player) {
    int newX = player.rect.x + player.direction.x * PLAYER_SPEED;
    int newY = player.rect.y + player.direction.y * PLAYER_SPEED;

    // Wall collision
    if (newX < 0 || newX + player.rect.w > WINDOW_WIDTH ||
        newY < 0 || newY + player.rect.h > WINDOW_HEIGHT) {
        player.health = 0;
        return;
    }

    player.rect.x = newX;
    player.rect.y = newY;

    // Update trail
    player.trail.push_front(player.rect);
    if (player.trail.size() > MAX_TRAIL_LENGTH) {
        player.trail.pop_back();
    }

    // Check for self-collision (excluding the latest trail segment)
    for (size_t i = 1; i < player.trail.size(); ++i) {
        if (checkTrailCollision(player, player.trail)) {
            player.health = 0;
            break;
        }
    }
}

void renderText(SDL_Renderer* renderer, const char* text, int x, int y, SDL_Color color, TTF_Font* font) {
    SDL_Surface* surface = TTF_RenderText_Solid(font, text, color);
    SDL_Texture* texture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_Rect textRect = { x, y, surface->w, surface->h };
    SDL_RenderCopy(renderer, texture, nullptr, &textRect);
    SDL_FreeSurface(surface);
    SDL_DestroyTexture(texture);
}

void renderStartMenu(SDL_Renderer* renderer, TTF_Font* font) {
    SDL_Color color = { 255, 255, 255, 255 };
    renderText(renderer, "TRON GAME", WINDOW_WIDTH / 2 - 100, WINDOW_HEIGHT / 2 - 50, color, font);
    renderText(renderer, "Press SPACE to Start", WINDOW_WIDTH / 2 - 150, WINDOW_HEIGHT / 2, color, font);
}

void renderPauseMenu(SDL_Renderer* renderer, TTF_Font* font) {
    SDL_Color color = { 255, 255, 255, 255 };
    renderText(renderer, "PAUSED", WINDOW_WIDTH / 2 - 50, WINDOW_HEIGHT / 2 - 50, color, font);
    renderText(renderer, "Press P to Resume", WINDOW_WIDTH / 2 - 100, WINDOW_HEIGHT / 2, color, font);
}

int main(int argc, char* argv[]) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
        return 1;
    }

    if (TTF_Init() == -1) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "TTF could not initialize! TTF_Error: %s\n", TTF_GetError());
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

    TTF_Font* font = TTF_OpenFont("SUSE-VariableFont_wght.ttf", 24);
    if (font == nullptr) {
        SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "Font could not be loaded! TTF_Error: %s\n", TTF_GetError());
        return 1;
    }

    Player player1 = { { 100, 300, 10, 10 }, { 1, 0 }, {}, 100, { 0, 0, 255, 255 } };
    Player player2 = { { 700, 300, 10, 10 }, { -1, 0 }, {}, 100, { 255, 0, 0, 255 } };

    bool quit = false;
    SDL_Event event;
    GameState gameState = MENU;

    Uint32 lastTime = SDL_GetTicks();
    float deltaTime = 0.0f;

    while (!quit) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                quit = true;
            }

            if (event.type == SDL_KEYDOWN) {
                switch (event.key.keysym.sym) {
                    case SDLK_SPACE:
                        if (gameState == MENU) {
                            gameState = PLAYING;
                        } else if (gameState == GAMEOVER) {
                            // Reset the game
                            player1 = { { 100, 300, 10, 10 }, { 1, 0 }, {}, 100, { 0, 0, 255, 255 } };
                            player2 = { { 700, 300, 10, 10 }, { -1, 0 }, {}, 100, { 255, 0, 0, 255 } };
                            gameState = PLAYING;
                        }
                        break;
                    case SDLK_p:
                        if (gameState == PLAYING) {
                            gameState = PAUSED;
                        } else if (gameState == PAUSED) {
                            gameState = PLAYING;
                        }
                        break;
                    case SDLK_ESCAPE:
                        quit = true;
                        break;
                }
            }
        }

        Uint32 currentTime = SDL_GetTicks();
        deltaTime = (currentTime - lastTime) / 1000.0f;
        lastTime = currentTime;

        if (gameState == PLAYING) {
            // Update player positions
            updatePlayerPosition(player1);
            updatePlayerPosition(player2);

            // Check for collisions
            if (player1.health <= 0 || player2.health <= 0 ||
                checkTrailCollision(player1, player2.trail) || checkTrailCollision(player2, player1.trail) ||
                checkCollision(player1.rect, player2.rect)) {
                gameState = GAMEOVER;
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
        }

        // Clear the renderer
        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
        SDL_RenderClear(renderer);

        if (gameState == MENU) {
            // Render the start menu
            renderStartMenu(renderer, font);
        } else if (gameState == PLAYING) {
            // Draw player trails
            SDL_SetRenderDrawColor(renderer, player1.color.r, player1.color.g, player1.color.b, player1.color.a);
            for (const auto& rect : player1.trail) {
                SDL_RenderFillRect(renderer, &rect);
            }

            SDL_SetRenderDrawColor(renderer, player2.color.r, player2.color.g, player2.color.b, player2.color.a);
            for (const auto& rect : player2.trail) {
                SDL_RenderFillRect(renderer, &rect);
            }

            // Draw players
            SDL_SetRenderDrawColor(renderer, player1.color.r, player1.color.g, player1.color.b, player1.color.a);
            SDL_RenderFillRect(renderer, &player1.rect);

            SDL_SetRenderDrawColor(renderer, player2.color.r, player2.color.g, player2.color.b, player2.color.a);
            SDL_RenderFillRect(renderer, &player2.rect);
        } else if (gameState == PAUSED) {
            // Render the pause menu
            renderPauseMenu(renderer, font);
        } else if (gameState == GAMEOVER) {
            // Render game over screen
            SDL_Color color = { 255, 255, 255, 255 };
            renderText(renderer, "GAME OVER", WINDOW_WIDTH / 2 - 100, WINDOW_HEIGHT / 2 - 50, color, font);
            renderText(renderer, "Press SPACE to Restart", WINDOW_WIDTH / 2 - 150, WINDOW_HEIGHT / 2, color, font);
        }

        // Present the renderer
        SDL_RenderPresent(renderer);

        // Cap the frame rate
        SDL_Delay(16);
    }

    // Cleanup
    TTF_CloseFont(font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();

    return 0;
}