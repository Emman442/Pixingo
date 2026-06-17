# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
from datetime import datetime, timezone
import json

# ─── Data Structures ──────────────────────────────────────────

@allow_storage
@dataclass
class Puzzle:
    puzzle_id: str
    image_1: str        # URL
    image_2: str        # URL
    image_3: str        # URL
    image_4: str        # URL
    theme: str          # category hint e.g. "Animals", "Movies"
    difficulty: str     # "easy" | "medium" | "hard"
    answer_hint: str    # broad hint for AI e.g. "a weather phenomenon"
    created_by: str     # wallet address of admin who added it
    created_at: str
    is_active: bool


@allow_storage
@dataclass
class RoundResult:
    puzzle_id: str
    player_answer: str
    ai_verdict: str     # "correct" | "incorrect" | "partial"
    score: i32
    time_taken_seconds: i32


@allow_storage
@dataclass
class SoloGame:
    game_id: str
    player: str
    status: str         # "active" | "completed" | "abandoned"
    current_round: i32
    total_rounds: i32
    total_score: i32
    puzzle_ids: DynArray[str]
    round_results: DynArray[RoundResult]



@allow_storage
@dataclass
class PlayerProfile:
    wallet: str
    username: str
    total_games: i32
    total_wins: i32
    total_score: i32
    solo_games: i32
    duel_games: i32
    royale_games: i32
    gen_earned: i32
    joined_at: str


class VisionQuest(gl.Contract):


    puzzles: TreeMap[str, Puzzle]
    puzzle_ids: DynArray[str]
    puzzle_counter: i32


    solo_games: TreeMap[str, SoloGame]

    game_counter: i32



    # Player profiles
    players: TreeMap[str, PlayerProfile]
    username_to_wallet: TreeMap[str, str]

    # Admin
    admin: str

    def __init__(self, admin_address: str):
        self.puzzle_counter = i32(0)
        self.game_counter = i32(0)
        self.admin = admin_address

    # ─── Helpers ──────────────────────────────────────────────

    def _only_admin(self) -> None:
        assert str(gl.message.sender_address) == self.admin, "Only admin"

    def _only_registered(self, wallet: str) -> None:
        assert wallet in self.players, "Player not registered"

    def _game_key(self) -> str:
        self.game_counter += i32(1)
        return f"game_{self.game_counter}"

    # ─── Player Registration ──────────────────────────────────

    @gl.public.write
    def register_player(self, username: str) -> None:
        wallet = str(gl.message.sender_address)
        assert wallet not in self.players, "Already registered"
        assert 2 <= len(username) <= 30, "Username must be 2-30 chars"
        normalized = username.lower().strip()
        assert normalized not in self.username_to_wallet, "Username taken"

        self.players[wallet] = PlayerProfile(
            wallet=wallet,
            username=normalized,
            total_games=i32(0),
            total_wins=i32(0),
            total_score=i32(0),
            solo_games=i32(0),
            duel_games=i32(0),
            royale_games=i32(0),
            gen_earned=i32(0),
            joined_at=gl.message_raw["datetime"]
        )
        self.username_to_wallet[normalized] = wallet

    @gl.public.view
    def get_player(self, wallet: str) -> PlayerProfile:
        assert wallet in self.players, "Player not found"
        return gl.storage.copy_to_memory(self.players[wallet])

    @gl.public.view
    def player_exists(self, wallet: str) -> bool:
        return wallet in self.players


    @gl.public.write
    def add_puzzle(
        self,
        image_1: str,
        image_2: str,
        image_3: str,
        image_4: str,
        theme: str,
        difficulty: str,
        answer_hint: str
    ) -> str:
        self._only_admin()
        assert difficulty in ["easy", "medium", "hard"], "Invalid difficulty"
        assert len(image_1) > 0, "Image 1 URL required"
        assert len(image_2) > 0, "Image 2 URL required"
        assert len(image_3) > 0, "Image 3 URL required"
        assert len(image_4) > 0, "Image 4 URL required"
       
        self.puzzle_counter += i32(1)
        puzzle_id = f"puzzle_{self.puzzle_counter}"

        self.puzzles[puzzle_id] = Puzzle(
            puzzle_id=puzzle_id,
            image_1=image_1,
            image_2=image_2,
            image_3=image_3,
            image_4=image_4,
            theme=theme,
            difficulty=difficulty,
            answer_hint=answer_hint,
            created_by=str(gl.message.sender_address),
            created_at=gl.message_raw["datetime"],
            is_active=True
        )
        self.puzzle_ids.append(puzzle_id)
        return puzzle_id

    @gl.public.write
    def deactivate_puzzle(self, puzzle_id: str) -> None:
        self._only_admin()
        assert puzzle_id in self.puzzles, "Puzzle not found"
        self.puzzles[puzzle_id].is_active = False

    @gl.public.view
    def get_puzzle(self, puzzle_id: str) -> Puzzle:
        assert puzzle_id in self.puzzles, "Puzzle not found"
        return gl.storage.copy_to_memory(self.puzzles[puzzle_id])

    @gl.public.view
    def get_all_puzzles(self) -> list[Puzzle]:
        result = []
        for pid in self.puzzle_ids:
            p = self.puzzles[pid]
            if p.is_active:
                result.append(gl.storage.copy_to_memory(p))
        return result

    @gl.public.view
    def get_total_puzzles(self) -> i32:
        return self.puzzle_counter


    @gl.public.write
    def start_solo_game(
        self,
        puzzle_ids: list[str],
    ) -> str:
        player = str(gl.message.sender_address)
        self._only_registered(player)

        assert 1 <= len(puzzle_ids) <= 10, "Must have 1-10 puzzles"
        for pid in puzzle_ids:
            assert pid in self.puzzles, f"Puzzle {pid} not found"
            assert self.puzzles[pid].is_active, f"Puzzle {pid} is inactive"

        game_id = self._game_key()

        puzzle_id_array: DynArray[str] = []
        for pid in puzzle_ids:
            puzzle_id_array.append(pid)

        self.solo_games[game_id] = SoloGame(
            game_id=game_id,
            player=player,
            status="active",
            current_round=i32(1),
            total_rounds=i32(len(puzzle_ids)),
            total_score=i32(0),
            puzzle_ids=puzzle_id_array,
            round_results=[],
        )

        self.players[player].total_games += i32(1)
        self.players[player].solo_games += i32(1)

        return game_id

    @gl.public.write
    def submit_solo_game(
    self,
    game_id: str,
    answers: list[str],
    time_taken_list: list[i32]
) -> None:
        player = str(gl.message.sender_address)

        assert game_id in self.solo_games, "Game not found"
        game = self.solo_games[game_id]
        assert game.player == player, "Not your game"
        assert game.status == "active", "Game not active"
        assert len(answers) == int(game.total_rounds), "Must submit all answers"
        assert len(time_taken_list) == int(game.total_rounds), "Must provide all times"

        total_score = i32(0)

        for i in range(len(answers)):
            puzzle_id = game.puzzle_ids[i]
            puzzle = self.puzzles[puzzle_id]
            answer = answers[i]
            time_taken = int(time_taken_list[i])
            image_1 = puzzle.image_1
            image_2 = puzzle.image_2
            image_3 = puzzle.image_3
            image_4 = puzzle.image_4
            theme = puzzle.theme
            difficulty = puzzle.difficulty
            answer_hint = puzzle.answer_hint

            def evaluate(
                a=answer, h=answer_hint, t=theme, d=difficulty,
                i1=image_1, i2=image_2, i3=image_3, i4=image_4
            ) -> str:
                prompt = f"""You are judging a 4 Pics 1 Word style puzzle game.

    Images:
    - Image 1: {i1}
    - Image 2: {i2}
    - Image 3: {i3}
    - Image 4: {i4}

    Theme: {t}
    Difficulty: {d}
    Answer hint: {h}

    Player answer: "{a}"

    Be generous with synonyms and semantically equivalent answers.
    Reply with ONLY one word: correct, partial, or incorrect
    """
                return gl.nondet.exec_prompt(prompt).strip().lower()

            verdict = gl.eq_principle.prompt_comparative(
                evaluate,
                principle="Return the most accurate verdict. Synonyms and semantically equivalent answers must be marked correct. Only mark incorrect if genuinely unrelated."
            ).strip().strip('"').lower()

            if verdict == "correct":
                score = 100
                if time_taken < 10:
                    score = 150
                elif time_taken < 20:
                    score = 130
            elif verdict == "partial":
                score = 50
            else:
                score = 0

            result = RoundResult(
                puzzle_id=puzzle_id,
                player_answer=answer,
                ai_verdict=verdict,
                score=i32(score),
                time_taken_seconds=i32(time_taken)
            )

            self.solo_games[game_id].round_results.append(result)
            total_score += i32(score)

        self.solo_games[game_id].total_score = total_score
        self.solo_games[game_id].status = "completed"
        self.players[player].total_score += total_score



    @gl.public.view
    def get_solo_game(self, game_id: str) -> SoloGame:
        assert game_id in self.solo_games, "Game not found"
        return gl.storage.copy_to_memory(self.solo_games[game_id])