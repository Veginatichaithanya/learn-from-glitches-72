import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Code } from "lucide-react";

const ErrorChallenge = () => {
  return (
    <section id="challenges" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Interactive Learning
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Try an{" "}
            <span className="bg-gradient-error bg-clip-text text-transparent">
              Error Challenge
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our unique learning approach. Debug this Python function and see how we guide you through the solution.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Challenge: Fix the Calculator Bug
                  </CardTitle>
                  <CardDescription className="mt-2">
                    This calculator function has a bug that causes incorrect results. Can you spot and fix it?
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge className="bg-destructive text-destructive-foreground">Bug Hunt</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Code Block */}
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-muted-foreground mb-2"># Buggy Calculator Function</div>
                  <div className="space-y-1">
                    <div><span className="text-primary">def</span> <span className="text-success">calculate</span>(<span className="text-warning">a</span>, <span className="text-warning">b</span>, <span className="text-warning">operation</span>):</div>
                    <div className="ml-4">
                      <span className="text-primary">if</span> operation == <span className="text-success">"add"</span>:
                    </div>
                    <div className="ml-8">
                      <span className="text-primary">return</span> a + b
                    </div>
                    <div className="ml-4">
                      <span className="text-primary">elif</span> operation == <span className="text-success">"subtract"</span>:
                    </div>
                    <div className="ml-8">
                      <span className="text-primary">return</span> a - b
                    </div>
                    <div className="ml-4">
                      <span className="text-primary">elif</span> operation == <span className="text-success">"multiply"</span>:
                    </div>
                    <div className="ml-8">
                      <span className="text-primary">return</span> a * b
                    </div>
                    <div className="ml-4">
                      <span className="text-primary">elif</span> operation == <span className="text-success">"divide"</span>:
                    </div>
                    <div className="ml-8 bg-destructive/20 px-2 py-1 rounded">
                      <span className="text-primary">return</span> a / b  <span className="text-destructive"># ⚠️ Potential error here!</span>
                    </div>
                    <div className="ml-4">
                      <span className="text-primary">else</span>:
                    </div>
                    <div className="ml-8">
                      <span className="text-primary">return</span> <span className="text-success">"Invalid operation"</span>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <div className="font-semibold text-destructive mb-1">ZeroDivisionError</div>
                        <div className="text-sm text-muted-foreground">
                          What happens when someone tries to divide by zero? This function doesn't handle that case!
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hint */}
                <Card className="border-warning/50 bg-warning/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <div className="font-semibold text-warning mb-1">Hint</div>
                        <div className="text-sm text-muted-foreground">
                          Add a condition to check if the divisor (b) is zero before performing division.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button variant="hero" className="flex-1">
                    <Code className="h-4 w-4 mr-2" />
                    Try This Challenge
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    See Solution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 text-center">
            <div>
              <div className="text-2xl font-bold text-success">92%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">3.2K</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">5 min</div>
              <div className="text-sm text-muted-foreground">Avg. Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorChallenge;