from flask_restx import fields
from app.instances import api

nli_evaluation_model = api.model(
    "NLIEvaluation",
    {
        "label": fields.String(required=True, description="NLI evaluation label"),
        "score": fields.Float(required=True, description="NLI evaluation score"),
    },
)

evaluation_result_model = api.model(
    "EvaluationResult",
    {
        "evaluation_question": fields.String(
            required=True, description="The evaluation question"
        ),
        "highest_cosine_similarity_score": fields.Float(
            required=True, description="Highest cosine similarity score"
        ),
        "highest_cosine_similarity_sentence": fields.String(
            required=True, description="Sentence with the highest cosine similarity"
        ),
        "nli_evaluation": fields.Nested(nli_evaluation_model),
    },
)

end_criteria_model = api.model(
    "EndCriteria",
    {
        "index": fields.String(required=True, description="Index of the end-criteria"),
        "question": fields.String(
            required=True, description="The question for the end-criteria"
        ),
        "possible_scores": fields.List(
            fields.Float,
            required=True,
            description="Possible scores for the end-criteria",
        ),
        "evaluation_result": fields.Nested(evaluation_result_model),
        "evaluation_score": fields.Float(
            required=True, description="Evaluation score for the end-criteria"
        ),
    },
)

sub_criteria_model = api.model(
    "SubCriteria",
    {
        "index": fields.String(required=True, description="Index of the sub-criteria"),
        "question": fields.String(
            required=True, description="The question for the sub-criteria"
        ),
        "possible_scores": fields.List(
            fields.Float,
            required=True,
            description="Possible scores for the sub-criteria",
        ),
        "evaluation_result": fields.Nested(evaluation_result_model),
        "evaluation_score": fields.Float(
            required=True, description="Evaluation score for the sub-criteria"
        ),
        "sub_criteria": fields.List(
            fields.Nested(end_criteria_model),
            description="Optional nested sub-criteria",
        ),
    },
)

criteria_model = api.model(
    "Criteria",
    {
        "index": fields.String(required=True, description="Index of the criteria"),
        "question": fields.String(
            required=True, description="The main question for the criteria"
        ),
        "possible_scores": fields.List(
            fields.Integer,
            required=True,
            description="Possible scores for the criteria",
        ),
        "sub_criteria": fields.List(
            fields.Nested(sub_criteria_model),
            description="Sub-criteria associated with the main criteria",
        ),
        "evaluation_score": fields.Float(
            required=True, description="Evaluation score for the criteria"
        ),
    },
)

criteria_section_model = api.model(
    "CriteriaSection",
    {
        "name": fields.String(required=True, description="Name of the project"),
        "criteria": fields.List(
            fields.Nested(criteria_model),
            description="Criteria associated with the project",
        ),
        "evaluation_score": fields.Float(
            required=True, description="Evaluation score for the criteria section"
        ),
    },
)

evaluation_response_model = api.model(
    "EvaluationResponse",
    {
        "evaluation": fields.List(
            fields.Nested(criteria_section_model),
            description="Evaluation of the project",
        ),
        "evaluation_score": fields.Float(
            required=True, description="Evaluation score for the project"
        ),
    },
)
