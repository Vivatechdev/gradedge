import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import {
  PageHero,
  PageBreadcrumb,
  CtaStrip,
} from "@/components/marketing/page-components";
import { GlossarySearch, type GlossaryTerm } from "@/components/marketing/GlossarySearch";

export const metadata: Metadata = buildMetadata({
  title: "Research Methods & Dissertation Glossary — Academic Terminology",
  description:
    "Plain-language definitions of common research and methods terms from epistemology to multivariate statistics.",
  path: "/resources/glossary",
});

const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: "Abstract", definition: "A concise 250 to 350-word synthesis of your complete study, outlining problem, methods, key findings, and theoretical contribution. Composed last." },
  { term: "Construct validity", definition: "The degree to which an operationalized measure or test actually evaluates the theoretical construct it is designed to quantify." },
  { term: "Cronbach's alpha", definition: "A metric of internal consistency reliability evaluating how closely related a set of survey scale items are. Values above 0.70 generally indicate acceptable reliability." },
  { term: "Deductive approach", definition: "A reasoning strategy that begins with established theoretical propositions, deduces formal hypotheses, and gathers empirical data to test them." },
  { term: "Epistemology", definition: "The branch of philosophy concerned with the nature, origin, scope, and justification of human knowledge: how we determine what counts as valid scholarly truth." },
  { term: "Factor analysis", definition: "A multivariate statistical technique used to identify underlying latent variables (factors) that explain correlations among a larger battery of observed variables." },
  { term: "Grounded theory", definition: "A qualitative methodology wherein conceptual theory is systematically derived inductively through iterative comparative analysis of empirical data." },
  { term: "Heteroscedasticity", definition: "The systematic non-constant variance of residual errors across levels of an independent variable in regression modeling, violating standard OLS assumptions." },
  { term: "Inductive approach", definition: "A bottom-up analytical approach that begins with detailed empirical observations, detects recurring patterns, and develops generalized theoretical models." },
  { term: "Internal validity", definition: "The rigor with which a study can credibly warrant a causal relationship between variables without confounding factors or alternative explanations." },
  { term: "Likert scale", definition: "A psychometric rating scale offering discrete, ordered response choices (typically 5 or 7 points from 'Strongly Disagree' to 'Strongly Agree')." },
  { term: "Multicollinearity", definition: "A statistical condition where two or more predictor variables in a multiple regression model are highly correlated, inflating parameter variance estimates." },
  { term: "Null hypothesis", definition: "A statistical hypothesis positing that no significant effect or relationship exists in the population. Inferential tests assess evidence to reject it." },
  { term: "Ontology", definition: "The philosophical study of the nature of reality and existence: whether reality is objective and independent of observers, or socially constructed." },
  { term: "Positionality", definition: "The explicit articulation of the researcher's personal background, cultural stance, and identity, examining how these shape the inquiry." },
  { term: "Purposive sampling", definition: "A non-probability sampling strategy where participants are intentionally selected because they possess specific characteristics required by the research design." },
  { term: "Research gap", definition: "An unresolved empirical discrepancy, theoretical tension, or under-investigated question within the scholarly literature that justifies a new study." },
  { term: "Reflexivity", definition: "The continuous practice of critically examining how a researcher's choices, values, and interpretive frameworks impact data collection and analysis." },
  { term: "Saturation (Data saturation)", definition: "The stage in qualitative data collection where collecting additional interviews or observations yields no novel conceptual insights or themes." },
  { term: "Triangulation", definition: "The application of multiple data sources, methodologies, or theoretical perspectives to corroborate empirical findings and strengthen research credibility." },
  { term: "Type I error", definition: "The incorrect rejection of a true null hypothesis (a false positive finding). Controlled by setting the alpha significance threshold." },
  { term: "Type II error", definition: "The failure to reject a false null hypothesis (a false negative finding). Inversely related to statistical test power." },
  { term: "Viva voce", definition: "The formal oral defense of a doctoral thesis conducted before an academic examination committee. Also referred to as an oral defense." },
];

export default function GlossaryPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Glossary" },
        ]}
      />

      <PageHero
        sectionNumber={1}
        sectionLabel="Academic Terminology"
        headline="Research methods glossary."
        standfirst="Plain-language definitions of terms you will encounter in academic research, thesis reviews, and committee meetings. Searchable and alphabetically indexed."
      />

      <div className="site-container py-12 md:py-16 max-w-4xl">
        <GlossarySearch terms={GLOSSARY_TERMS} />
      </div>

      <CtaStrip
        headline="Need help applying these research methods?"
        subtext="Book an introductory session with an academic mentor to audit your methodology chapter."
        ctaLabel="Book a free consultation"
        ctaHref="/book"
      />
    </>
  );
}

