from .interfaces import ConfigurationsABC


class SectorEvaluationCriteriaConfigurations(ConfigurationsABC):
    json_directory_path = "./app/data/json/sector-evaluation-criteria"

    sector_evaluation_criteria_map = {
        "agriculture_and_agrarian_reform": "agriculture_and_agrarian_reform.json",
        "child_labor": "child_labor.json",
        "development_planning": "development_planning.json",
        "disaster_risk_reduction_management": "disaster_risk_reduction_management.json",
        "employment_and_work_related": "employment_and_work_related.json",
        "energy": "energy.json",
        "fisheries": "fisheries.json",
        "generic": "generic.json",
        "ict": "ict.json",
        "infrastructure": "infrastructure.json",
        "justice": "justice.json",
        "labor_migration": "labor_migration.json",
        "microfinance": "microfinance.json",
        "natural_resource_management": "natural_resource_management.json",
        "private_sector_development": "private_sector_development.json",
        "social_sector_education": "social_sector_education.json",
        "social_sector_health": "social_sector_health.json",
        "social_sector_housing_and_settlement": "social_sector_housing_and_settlement.json",
        "social_sector_women_in_areas_under_armed_conflict": "social_sector_women_in_areas_under_armed_conflict.json",
        "tourism": "tourism.json",
    }
