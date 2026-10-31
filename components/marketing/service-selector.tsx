"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Photo } from "@/components/ui/photo";
import {
  SELECTOR_QUESTIONS,
  computeRecommendations,
  type SelectorQuestion,
} from "@/lib/service-selector";
import { getServiceBySlug, type ServiceContentItem } from "@/lib/data/services-content";

export function ServiceSelector() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion: SelectorQuestion = SELECTOR_QUESTIONS[currentStepIndex];

  function handleSelectOption(optionId: string) {
    const nextAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(nextAnswers);

    if (currentStepIndex < SELECTOR_QUESTIONS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  }

  function handleBack() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  function handleReset() {
    setAnswers({});
    setCurrentStepIndex(0);
    setIsCompleted(false);
  }

  const recommendations = isCompleted
    ? computeRecommendations(answers.stage || "", answers.blocker || "", answers.deadline || "")
        .map((rec) => ({
          service: getServiceBySlug(rec.slug),
          reason: rec.reason,
        }))
        .filter((r): r is { service: ServiceContentItem; reason: string } => Boolean(r.service))
    : [];

  return (
    <div
      id="service-selector"
      className="bg-paper border border-tone-rule rounded-[2px] p-6 sm:p-10 shadow-xs space-y-8"
    >
      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-tone-rule pb-4">
            <div className="space-y-1">
              <span className="type-micro text-tone-muted">
                Step 0{currentQuestion.stepNumber} of 0{SELECTOR_QUESTIONS.length}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
                {currentQuestion.question}
              </h3>
              <p className="text-xs text-tone-muted">{currentQuestion.hint}</p>
            </div>
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="text-xs text-tone-muted hover:text-navy underline cursor-pointer"
              >
                &larr; Back
              </button>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`text-left p-4 rounded-[2px] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold ${
                    isSelected
                      ? "border-navy bg-cream/70 shadow-xs"
                      : "border-tone-rule bg-white hover:border-gold/60 hover:bg-cream/20"
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-serif text-sm font-medium text-tone-heading">
                      {option.label}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 mt-0.5 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? "border-navy bg-navy" : "border-tone-rule bg-white"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <p className="text-xs text-tone-muted mt-1 leading-normal">{option.description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-tone-muted pt-2">
            <span>Click any option to advance. No personal details required.</span>
            <span className="font-mono text-[11px]">
              {Math.round(((currentStepIndex + 1) / SELECTOR_QUESTIONS.length) * 100)}% Complete
            </span>
          </div>
        </div>
      ) : (
        /* Completed Results */
        <div className="space-y-8">
          <div className="border-b border-tone-rule pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="type-micro text-gold">Matched Recommendations</span>
              <h3 className="font-serif text-2xl text-tone-heading font-medium mt-1">
                Based on your research stage, here is your tailored path:
              </h3>
              <p className="text-xs text-tone-muted mt-1">
                We selected these services specifically to address your stated bottleneck and timeframe.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-tone-muted hover:text-navy underline cursor-pointer"
            >
              Start Over &crarr;
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {recommendations.map(({ service, reason }, idx) => (
              <div
                key={service.slug}
                className="p-6 bg-white border border-tone-rule rounded-[2px] flex flex-col md:flex-row items-start gap-6 hover:border-navy transition-colors"
              >
                <div className="w-full md:w-48 shrink-0">
                  <div className="border border-tone-rule rounded-[2px] overflow-hidden">
                    <Photo
                      src={service.hero_image}
                      alt={service.hero_image_alt}
                      aspectRatio="3:2"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </div>
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={idx === 0 ? "gold" : "navy"}>
                      {idx === 0 ? "Primary Recommendation" : "Complementary Service"}
                    </Badge>
                    <span className="text-[11px] text-tone-muted">&bull;</span>
                    <span className="text-[11px] text-tone-muted">{service.format_text}</span>
                  </div>

                  <h4 className="font-serif text-xl text-tone-heading font-medium">
                    <Link href={`/services/${service.slug}`} className="hover:text-navy transition-colors">
                      {service.title}
                    </Link>
                  </h4>

                  <div className="p-3 bg-cream/70 border-l-2 border-gold text-xs text-tone-body rounded-[1px]">
                    <strong className="text-tone-heading block mb-0.5">Why this fits your bottleneck:</strong>
                    {reason}
                  </div>

                  <p className="text-xs text-tone-muted leading-relaxed line-clamp-2">
                    {service.two_sentence_promise}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-tone-rule text-xs">
                    <div>
                      <span className="text-[11px] text-tone-muted block">Starting from:</span>
                      <span className="font-semibold text-tone-heading text-sm">
                        ₦{service.starting_price_ngn.toLocaleString()}{" "}
                        <span className="text-tone-muted font-normal text-xs">/ ${service.starting_price_usd}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" href={`/services/${service.slug}`}>
                        Explore Full Service Details
                      </Button>
                      <Button variant="accent" size="sm" href={`/book?service=${service.slug}`}>
                        Book Free Consultation &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-cream border border-gold/30 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <strong className="text-tone-heading block">Still unsure which service matches your exact methodology?</strong>
              <span className="text-tone-muted">
                Book an introductory 20-minute consultation. We review your draft and agree on the right service together.
              </span>
            </div>
            <Button variant="primary" size="sm" href="/book">
              Schedule Free 20-Min Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

