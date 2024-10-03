"use client";

import ArrowIcon from "@/components/arrow-icon";
import Logo from "@/components/logo";
import SparklesIcon from "@/components/sparkles-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { FormEvent, useState } from "react";
import imagePlaceholder from "@/public/image-placeholder.png";
import Spinner from "@/components/spinner";
import GithubIcon from "@/components/github-icon";
import XIcon from "@/components/x-icon";

let models = [
  { label: "Flux 1.1 Pro", value: "black-forest-labs/FLUX.1.1-pro" },
  { label: "Flux Schnell", value: "black-forest-labs/FLUX.1-schnell" },
];

export default function Home() {
  let [isLoading, setIsLoading] = useState(false);
  let [prompt, setPrompt] = useState("");
  let [model, setModel] = useState(models[0].value);
  let [images, setImages] = useState<{ url: string }[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    let res = await fetch("/api/generateImages", {
      method: "POST",
      body: JSON.stringify({ model, prompt }),
    });
    let json = await res.json();

    setIsLoading(false);
    setImages(json);
  }

  return (
    <div className="flex h-full flex-col px-5">
      <header className="flex justify-center pt-6">
        <a href="https://www.together.ai/" target="_blank">
          <Logo />
        </a>
      </header>

      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md">
          <fieldset disabled={isLoading}>
            <div className="relative">
              <Input
                spellCheck={false}
                placeholder="Describe your image..."
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-12 border-gray-300 border-opacity-50 bg-gray-400 pl-4 pr-16 placeholder-gray-300 lg:h-14 lg:pl-4 lg:text-base"
              />
              <div className="absolute right-2 top-0 flex h-full items-center justify-center lg:right-4">
                <Button
                  type="submit"
                  className="group relative size-8 p-0 disabled:bg-transparent disabled:text-white"
                >
                  <ArrowIcon className="size-8 group-disabled:hidden" />

                  <div className="absolute inset-0 hidden items-center justify-center group-disabled:flex">
                    <Spinner className="size-4" />
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <Select
                name="model"
                value={model}
                onValueChange={setModel}
                disabled={isLoading}
              >
                <SelectTrigger className="grow bg-gray-500 shadow-sm shadow-black">
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                type="button"
                className="inline-flex items-center gap-1 whitespace-nowrap px-3 text-sm shadow-sm shadow-black"
              >
                <SparklesIcon className="size-4" />
                Enhance prompt
              </Button>
            </div>
          </fieldset>
        </form>
      </div>

      <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
        {images.length === 0 ? (
          <div className="max-w-xl lg:max-w-3xl">
            <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-5xl">
              Generate images in seconds
            </p>
            <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
              Enter a prompt, choose a model, enhance your prompt, and generate
              images in the blink of an eye.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid w-full max-w-7xl gap-8 md:grid-cols-2">
            {images.map((image, i) => (
              <div key={image.url}>
                <Image
                  placeholder="blur"
                  blurDataURL={imagePlaceholder.blurDataURL}
                  width={1024}
                  height={768}
                  src={image.url}
                  alt=""
                  className={`${isLoading ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
                  style={{
                    animationDelay: `${i * 75}ms`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 w-full items-center pb-10 text-center text-gray-300 md:flex md:justify-between">
        <p>Powered by Together.ai & Flux</p>

        <div className="mt-8 flex items-center justify-center md:mt-0 md:justify-between md:gap-6">
          <p className="hidden whitespace-nowrap text-xs md:block">
            100% free and open source
          </p>

          <div className="flex gap-6 md:gap-2">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <GithubIcon className="size-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <XIcon className="size-3" />
              Twitter
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
