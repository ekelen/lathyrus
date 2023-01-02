import React, { useEffect, useMemo, useRef, useState } from "react";
import { ITEMS_BY_ID, RECIPES_BY_ID } from "../data/data";
import { useGame, useGameDispatch } from "../state/GameContext";
import { Button } from "./components/Button";
import { CaptiveImage } from "./components/Captive";
import { Item, ItemButton } from "./components/Item";
import Svg from "./components/Svg";
import Cage from "./img/cage2.svg";
import { GET_MONSTER_IMAGE } from "./img/Monster";
import Wizard from "./img/wizard.svg";

function ComplainingMonsterOverlay() {
  return (
    <div className="absolute flex flex-col w-full">
      <div className="flex w-full items-center">
        <div className="h-12 w-12 min-w-max text-blue-500">
          <Svg source={GET_MONSTER_IMAGE("goblin")} />
        </div>
        <div className="bg-black rounded-md border z-20 p-1">
          Yo, we are really sick of your crap, man.
        </div>
      </div>
      <div className="flex w-full items-center">
        <div className="h-12 w-12 text-blue-700">
          <Svg source={GET_MONSTER_IMAGE("zombie")} />
        </div>
        <div className="bg-black rounded-md border z-20 p-1">Word.</div>
      </div>
      <div className="flex w-full items-center ">
        <div className="h-12 w-12 text-blue-800">
          <Svg source={GET_MONSTER_IMAGE("dragon")} />
        </div>
        <div className="bg-black rounded-md border z-20 p-1">
          I'll handle him.
        </div>
      </div>
    </div>
  );
}

function DropCageScreen() {
  const cageRef = useRef(null);
  const dragonRef = useRef(null);
  useEffect(() => {
    let timer;
    if (cageRef.current && dragonRef.current) {
      timer = setTimeout(() => {
        cageRef.current.style.transform = "translateY(0)";
        dragonRef.current.style.transform = "translateY(300%)";
        dragonRef.current.classList.add("animate-bounce");
      }, 400);
    }
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div
        ref={dragonRef}
        className={`absolute top-0 left-1/4 min-w-max h-32 transition-transform duration-700 ease-in-out delay-1000 text-blue-400 z-30`}
        style={{ transform: `translateY(-100vh)` }}
      >
        <Svg source={GET_MONSTER_IMAGE("dragon")} height="80%" />
      </div>
      <div
        ref={cageRef}
        className="absolute top-0 w-full h-80 transition-transform duration-700 ease-in-out text-slate-600 z-20"
        style={{ transform: `translateY(-100vh)` }}
      >
        <Svg source={Cage} height="80%" />
      </div>
    </>
  );
}

function PostChallenge({ score, maxScore }) {
  const [showStartText, setShowStartText] = useState(true);
  const [dropCage, setDropCage] = useState(false);
  const dispatch = useGameDispatch();
  const handleRestart = () => {
    dispatch({ type: "reset" });
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-col w-full h-72 relative">
        {dropCage ? (
          <DropCageScreen />
        ) : !showStartText ? (
          <ComplainingMonsterOverlay />
        ) : (
          <div>
            <span className="text-white">
              {score}/{maxScore}
            </span>
            ? Well, in spite of your efforts, I can't just let you leave...
          </div>
        )}
        <div className="absolute bottom-0 w-56 h-56 z-10">
          <Svg source={Wizard} height={"80%"} width={"100%"} />
        </div>
      </div>

      <div className="flex items-center mt-auto gap-3 text-xs">
        {showStartText ? (
          <Button onClick={() => setShowStartText(false)} className="px-2 py-1">
            Sooooo...
          </Button>
        ) : dropCage ? (
          <Button onClick={() => handleRestart()} className="px-2 py-1">
            The End. Restart?
          </Button>
        ) : (
          <Button
            onClick={() => {
              setDropCage(true);
            }}
            className="px-2 py-1"
          >
            You go ahead...
          </Button>
        )}
      </div>
    </div>
  );
}

function Challenge({
  progress,
  score,
  setScore,
  selectedRecipe,
  relatedCaptive,
  recipeList,
  previousAnswerCorrect,
  handleSubmitAnswer,
  setError,
}) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex w-full">
        <div className="h-12 w-12 min-w-max relative">
          <Svg source={Wizard} height={"80%"} width={"100%"} />
        </div>
        <div className="flex-shrink">
          {progress == 0
            ? null
            : previousAnswerCorrect
            ? "You got lucky with that one..."
            : "That appears incorrect. Priceless knowledge... lost..."}
          Answer me this:
        </div>
      </div>
      <div className="flex mt-5 border border-slate-400 rounded-md items-center px-2 py-1">
        {selectedRecipe.ingredients.map((ingredient, i) => (
          <div
            className="flex items-center justify-center whitespace-pre"
            key={`${ingredient.id}-${i}`}
          >
            <Item item={ITEMS_BY_ID[ingredient.itemId]} />
            <div>{i < selectedRecipe.ingredients.length - 1 ? "+" : "⟶"}</div>
          </div>
        ))}
        <Item symbol="?" />
      </div>
      <div className="flex items-center justify-center gap-3 h-16 mt-4">
        {recipeList.map((recipe) => {
          const isHinted =
            relatedCaptive.teaches.recipeId === recipe.id &&
            relatedCaptive.freed &&
            !relatedCaptive.dead;
          return (
            <div
              className="flex flex-col items-center"
              key={`${"recipe"}-${recipe.id}`}
            >
              <ItemButton
                item={ITEMS_BY_ID[recipe.id]}
                key={`${recipe.id}`}
                onClick={() => handleSubmitAnswer(recipe.id)}
                className={isHinted ? "animate-bounce" : ""}
              />
              <div>
                {isHinted ? (
                  <span className={`${relatedCaptive.colorClass} text-xl`}>
                    ⬆
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center mt-auto gap-3">
        <div
          className={`${relatedCaptive.colorClass} border px-2 py-2 rounded-md border-slate-400`}
        >
          <div className="h-5 w-5">
            <CaptiveImage captive={relatedCaptive} />
          </div>
        </div>
        <div>
          {relatedCaptive.dead ? (
            <span>Too bad you killed me, I might have been helpful...</span>
          ) : relatedCaptive.freed ? (
            <span>Thanks for freeing me... I got this ;)</span>
          ) : (
            <span>I might have helped, if you'd freed me...</span>
          )}
        </div>
      </div>
    </div>
  );
}

function EndIntro({ setShowChallenge }) {
  return (
    <>
      <div className="flex">
        <div className="h-12 w-12 min-w-max relative">
          <Svg source={Wizard} height={"80%"} width={"100%"} />
        </div>
        <div className="flex-shrink">
          My research!!! You've trampled all over everything!!!
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center w-full flex-grow">
        <div>
          If you can give me the knowledge shared with you by my test subjects,
          I may let you live.
        </div>
      </div>
      <Button onClick={() => setShowChallenge(true)} className="px-2 py-1">
        Start
      </Button>
    </>
  );
}

function EndGame() {
  const { learnedRecipeIds, captivesByRoomId } = useGame();

  const [score, setScore] = useState(0);

  const [error, setError] = useState(false);

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => setError(false), 800);
    }
  }, [error]);

  const recipeList = Object.values(RECIPES_BY_ID);
  const maxScore = recipeList.length;

  const [progress, setProgress] = useState(0);

  const [showChallenge, setShowChallenge] = useState(false);

  const [previousAnswerCorrect, setPreviousAnswerCorrect] = useState(false);

  const selectedRecipe = recipeList[progress] ?? null;

  const relatedCaptive = useMemo(() => {
    return !selectedRecipe
      ? null
      : Object.values(captivesByRoomId).find((captive) => {
          return captive.teaches.recipeId === selectedRecipe.id;
        });
  }, [selectedRecipe]);

  const handleSubmitAnswer = (itemId) => {
    if (!selectedRecipe) return;
    if (itemId === selectedRecipe.id) {
      setScore(score + 1);
      setPreviousAnswerCorrect(true);
    } else {
      setPreviousAnswerCorrect(false);
      setError(true);
    }
    setProgress(progress + 1);
  };

  const colorClass = !error ? "border-slate-400" : "border-orange-900";

  return (
    <div
      className={`w-60 h-96 px-4 py-4 rounded-md border whitespace-pre-line bg-black text-sm   relative flex flex-col items-center text-slate-400 ${colorClass} transition-colors duration-300 ease-in-out`}
    >
      {!selectedRecipe ? (
        <PostChallenge score={score} maxScore={maxScore} />
      ) : !showChallenge ? (
        <EndIntro setShowChallenge={setShowChallenge} />
      ) : (
        <Challenge
          progress={progress}
          score={score}
          setScore={setScore}
          selectedRecipe={selectedRecipe}
          relatedCaptive={relatedCaptive}
          recipeList={recipeList}
          previousAnswerCorrect={previousAnswerCorrect}
          handleSubmitAnswer={handleSubmitAnswer}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
}

export default EndGame;
