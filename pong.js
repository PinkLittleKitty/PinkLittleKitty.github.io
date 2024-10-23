const game = {
    running: false,
    ball: {
        x: 0,
        y: 0,
        speed: 5,
        dx: 1,
        dy: 1
    },
    playerScore: 0,
    aiScore: 0
};

function stopPongAnimation() {
    const typePong = document.querySelector('.type-pong');
    typePong.style.animation = 'none';
    const ball = document.querySelector('.ball');
    ball.style.animation = 'none';
    const rackets = document.querySelectorAll('.racket');
    rackets.forEach(racket => racket.style.animation = 'none');
}
  function startPongGame() {
      if (game.running) return;
      stopPongAnimation();
    
      const profilePic = document.getElementById('profilePicture').querySelector('img');
      const justneki = document.getElementById('pongBall');
    
      // Animate profile picture
      profilePic.style.transition = 'all 0.5s ease-in-out';
      profilePic.style.width = '30px';
      profilePic.style.height = '30px';
      justneki.style.display = 'none';
    
      // Start game after animation
      setTimeout(() => {
        profilePic.style.display = 'none';
          game.running = true;
        
          const gameArea = document.getElementById('pongGame');
          const ball = document.createElement('div');
          ball.id = 'pongBall';
          ball.style.width = '30px';
          ball.style.height = '30px';
          ball.style.position = 'absolute';
          ball.style.borderRadius = '50%';
          ball.style.backgroundImage = 'url(https://avatars.githubusercontent.com/PinkLittleKitty)';
          ball.style.backgroundSize = 'cover';
          gameArea.appendChild(ball);

          const playerPaddle = document.getElementById('playerPaddle');
          const aiPaddle = document.getElementById('aiPaddle');

          const gameWidth = gameArea.offsetWidth;
          const gameHeight = gameArea.offsetHeight;
    
          // Reset scores and ball position
          game.playerScore = 0;
          game.aiScore = 0;
    
          function resetBall() {
              game.ball.x = gameWidth / 2 - 15; // Half of ball width
              game.ball.y = gameHeight / 2 - 15; // Half of ball height
              game.ball.speed = 5;
              game.ball.dx *= -1;
          }
    
          resetBall();
    
          // Set AI paddle initial position
          aiPaddle.style.right = '0';
          aiPaddle.style.top = `${gameHeight / 2 - aiPaddle.offsetHeight / 2}px`;

          // Mouse/Touch controls for player paddle
          gameArea.addEventListener('mousemove', (e) => {
              const rect = gameArea.getBoundingClientRect();
              const relativeY = e.clientY - rect.top;
              playerPaddle.style.top = `${Math.min(Math.max(relativeY, 0), rect.height - playerPaddle.offsetHeight)}px`;
          });

          function gameLoop() {
              if (!game.running) return;

              game.ball.x += game.ball.speed * game.ball.dx;
              game.ball.y += game.ball.speed * game.ball.dy;

              // Wall collisions
              if (game.ball.y <= 0 || game.ball.y >= gameHeight - 30) {
                  game.ball.dy *= -1;
              }

              // Paddle collisions
              const ballRect = ball.getBoundingClientRect();
              const playerRect = playerPaddle.getBoundingClientRect();
              const aiRect = aiPaddle.getBoundingClientRect();

              // Player paddle collision
              if (game.ball.dx < 0) {
                  const playerRect = playerPaddle.getBoundingClientRect();
                  const ballRect = ball.getBoundingClientRect();
                  if (ballRect.left <= playerRect.right &&
                      ballRect.right >= playerRect.left &&
                      ballRect.bottom >= playerRect.top &&
                      ballRect.top <= playerRect.bottom) {
                      game.ball.dx *= -1;
                      game.ball.speed += 0.2;
                  }
              }

              // AI paddle collision 
              if (game.ball.dx > 0) {
                  const aiRect = aiPaddle.getBoundingClientRect();
                  const ballRect = ball.getBoundingClientRect();
                  if (ballRect.right >= aiRect.left &&
                      ballRect.left <= aiRect.right &&
                      ballRect.bottom >= aiRect.top &&
                      ballRect.top <= aiRect.bottom) {
                      game.ball.dx *= -1;
                      game.ball.speed += 0.2;
                  }
              }

              // Scoring
              if (game.ball.x <= 0) {
                  game.aiScore++;
                  updateScore();
                  resetBall();
              } else if (game.ball.x + 30 >= gameWidth) {
                  game.playerScore++;
                  updateScore();
                  resetBall();
              }
    // AI paddle movement with boundaries and human-like behavior
    const aiPaddleTop = parseInt(aiPaddle.style.top) || 0;
    const ballCenter = game.ball.y + 15;
    const aiCenter = aiPaddleTop + aiRect.height / 2;
    const reactionSpeed = 3; // Slower movement speed
    const predictionError = Math.random() * 20 - 10; // Adds some randomness to targeting

    let newAiTop = aiPaddleTop;
    // Only move if the ball is moving towards the AI
    if (game.ball.dx > 0) {
        if (aiCenter < ballCenter + predictionError - 10) {
            newAiTop = Math.min(aiPaddleTop + reactionSpeed, gameHeight - aiRect.height);
        } else if (aiCenter > ballCenter + predictionError + 10) {
            newAiTop = Math.max(aiPaddleTop - reactionSpeed, 0);
        }
    }
    aiPaddle.style.top = `${newAiTop}px`;
              ball.style.left = `${game.ball.x}px`;
              ball.style.top = `${game.ball.y}px`;

              requestAnimationFrame(gameLoop);
          }

          gameLoop();
      }, 500);
  }function updateScore() {
    document.getElementById('playerScore').textContent = game.playerScore;
    document.getElementById('aiScore').textContent = game.aiScore;
}